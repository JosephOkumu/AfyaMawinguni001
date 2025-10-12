// Environment-based configuration utility
export const getEnvironmentConfig = () => {
  const isLocal = window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1' ||
                  window.location.hostname.includes('192.168.') ||
                  window.location.hostname.includes('10.0.') ||
                  window.location.hostname.includes('172.');

  return {
    apiUrl: isLocal ? 'http://localhost:8000/api' : 'https://acesohealth.co.ke/api',
    baseUrl: isLocal ? 'http://localhost:8080' : 'https://acesohealth.co.ke',
    domain: isLocal ? 'localhost.dev' : 'acesohealth.co.ke'
  };
};

export const { apiUrl, baseUrl, domain } = getEnvironmentConfig();
