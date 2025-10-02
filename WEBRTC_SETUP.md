# WebRTC Video Call Implementation

## Overview
This document covers the WebRTC video call implementation for the AfyaMawinguni001 healthcare platform, including production deployment considerations.

## Architecture
- **Frontend**: React with custom useWebRTC hook
- **Backend**: Laravel API with cache-based signaling
- **Signaling**: HTTP polling (no WebSocket required)
- **Media**: Peer-to-peer WebRTC connections

## Files Structure
```
Backend/
├── app/Http/Controllers/AppointmentController.php  # WebRTC signaling endpoints
└── routes/api.php                                  # API routes

Frontend/
├── src/components/VideoCall.tsx                    # Video call modal
├── src/hooks/useWebRTC.ts                         # WebRTC functionality
├── src/components/dashboard/AppointmentsSection.tsx # "View Call" button
├── src/pages/AppointmentDetails.tsx               # Modal integration
├── src/services/api.ts                            # API service
└── src/components/calendar/AppointmentCalendar.tsx # Calendar integration
```

## Production Deployment Guide

### 1. HTTPS Requirements
WebRTC **requires HTTPS** in production. Browsers block camera/microphone access on HTTP.

**SSL Certificate Setup:**
```bash
# Using Let's Encrypt with Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

**Nginx Configuration:**
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;  # Frontend
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api {
        proxy_pass http://localhost:8000;  # Backend API
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 2. STUN/TURN Server Configuration

**For Production, consider dedicated STUN/TURN servers:**

```typescript
// In useWebRTC.ts - Update peer connection config
peerConnection.current = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    // Add TURN server for better connectivity
    {
      urls: 'turn:your-turn-server.com:3478',
      username: 'your-username',
      credential: 'your-password'
    }
  ]
});
```

**TURN Server Setup (Optional but recommended):**
```bash
# Install coturn
sudo apt install coturn

# Configure /etc/turnserver.conf
listening-port=3478
tls-listening-port=5349
relay-ip=YOUR_SERVER_IP
external-ip=YOUR_SERVER_IP
realm=yourdomain.com
server-name=yourdomain.com
lt-cred-mech
user=username:password
```

### 3. Laravel Production Configuration

**Cache Configuration:**
```bash
# Use Redis for better performance
composer require predis/predis

# In .env
CACHE_DRIVER=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

**API Rate Limiting:**
```php
// In routes/api.php - Add rate limiting
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    Route::post('/appointments/{id}/start-call', [AppointmentController::class, 'startCall']);
    Route::post('/appointments/{id}/join-call', [AppointmentController::class, 'joinCall']);
    Route::get('/appointments/{id}/signals', [AppointmentController::class, 'getSignals']);
    Route::post('/appointments/{id}/signal', [AppointmentController::class, 'storeSignal']);
});
```

### 4. Frontend Production Build

**Environment Variables:**
```bash
# .env.production
VITE_API_BASE_URL=https://yourdomain.com/api
VITE_APP_ENV=production
```

**Build and Deploy:**
```bash
# Build for production
npm run build

# Serve with nginx or deploy to CDN
sudo cp -r dist/* /var/www/html/
```

### 5. Monitoring and Logging

**Backend Logging:**
```php
// In AppointmentController.php - Add production logging
use Illuminate\Support\Facades\Log;

public function storeSignal(Request $request, $id) {
    try {
        // ... existing code
        Log::info('WebRTC signal stored', ['appointment_id' => $id, 'signal_type' => $signal['type']]);
    } catch (\Exception $e) {
        Log::error('WebRTC signal error', ['error' => $e->getMessage(), 'appointment_id' => $id]);
        throw $e;
    }
}
```

**Frontend Error Tracking:**
```typescript
// Add to useWebRTC.ts
const logError = (error: any, context: string) => {
  console.error(`WebRTC Error [${context}]:`, error);
  
  // Send to error tracking service (e.g., Sentry)
  if (process.env.NODE_ENV === 'production') {
    // Sentry.captureException(error, { tags: { context } });
  }
};
```

### 6. Security Considerations

**CORS Configuration:**
```php
// In config/cors.php
'paths' => ['api/*'],
'allowed_methods' => ['*'],
'allowed_origins' => ['https://yourdomain.com'],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

**CSP Headers:**
```nginx
# Add to nginx config
add_header Content-Security-Policy "default-src 'self'; media-src 'self' blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';";
```

### 7. Performance Optimization

**Laravel Optimizations:**
```bash
# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Enable OPcache in production
```

**Frontend Optimizations:**
```typescript
// Lazy load VideoCall component
const VideoCall = lazy(() => import('@/components/VideoCall'));

// Use React.memo for performance
export const VideoCall = React.memo<VideoCallProps>(({ isOpen, onClose, appointmentId }) => {
  // ... component code
});
```

### 8. Testing in Production

**WebRTC Connection Test:**
1. Test from different networks (WiFi, mobile data)
2. Test with different browsers (Chrome, Firefox, Safari)
3. Test firewall traversal (corporate networks)
4. Monitor connection success rates

**Load Testing:**
```bash
# Test concurrent video calls
# Monitor server resources during peak usage
```

### 9. Troubleshooting Common Issues

**Camera/Microphone Access:**
- Ensure HTTPS is properly configured
- Check browser permissions
- Test on different devices

**Connection Failures:**
- Verify STUN/TURN server accessibility
- Check firewall rules
- Monitor ICE candidate exchange

**Performance Issues:**
- Optimize video constraints
- Monitor bandwidth usage
- Implement adaptive bitrate

### 10. Backup and Recovery

**Database Backups:**
```bash
# Backup appointments and user data
mysqldump -u root -p afyamawinguni > backup.sql
```

**Cache Recovery:**
- WebRTC sessions are temporary (30-minute expiration)
- No persistent data loss if cache fails
- Sessions auto-recreate on reconnection

## Support and Maintenance

- Monitor error logs regularly
- Update STUN server lists periodically
- Test WebRTC functionality after browser updates
- Keep SSL certificates renewed

## Additional Resources

- [WebRTC Documentation](https://webrtc.org/getting-started/)
- [MDN WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [TURN Server Setup Guide](https://github.com/coturn/coturn)