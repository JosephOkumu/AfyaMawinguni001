import api from './api';

export interface ReviewData {
  appointment_id: number;
  rating: number;
  review_text?: string;
}

export interface Review {
  id: number;
  patient_name: string;
  rating: number;
  review_text: string;
  created_at: string;
}

export interface DoctorReviewsResponse {
  reviews: Review[];
  average_rating: number;
  total_reviews: number;
  current_user_reviewed: boolean;
}

class ReviewService {
  async submitReview(reviewData: ReviewData): Promise<any> {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to submit review');
    }
  }

  async getDoctorReviews(doctorId: number): Promise<DoctorReviewsResponse> {
    try {
      const response = await api.get(`/doctors/${doctorId}/reviews`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch reviews');
    }
  }

}

export default new ReviewService();
