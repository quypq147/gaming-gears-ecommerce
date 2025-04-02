import { axiosInstance } from "@/src/lib/axios";

/**
 * Gửi bình luận mới
 * @param productId ID của sản phẩm
 * @param reviewData Dữ liệu bình luận
 */
export const submitReview = async (
  productId: number,
  reviewData: { review: string; rating: number }
) => {
  const token = localStorage.getItem("token");
  console.log("Token in submitReview:", token); // Ghi log token để kiểm tra
  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    const response = await axiosInstance.post(
      `/reviews`,
      {
        data: {
          review: reviewData.review, // Nội dung bình luận
          rating: reviewData.rating, // Số sao đánh giá
          product: productId, // Gửi ID sản phẩm
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header
        },
      }
    );

    console.log("Review submitted successfully:", response.data);
    const reviewDataResponse = response.data.data;
    // Trả về dữ liệu bình luận mới
    return {
      id: reviewDataResponse.id,
      review: reviewDataResponse.attributes.review,
      rating: reviewDataResponse.attributes.rating,
      user: reviewDataResponse.attributes.users_permissions_user?.username,
      createdAt: reviewDataResponse.attributes.createdAt,
    };
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to submit review";
    console.error("Error submitting review:", errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Lấy danh sách review của sản phẩm
 * @param productId ID của sản phẩm
 */
export const fetchReviews = async (productId: number) => {
  try {
    const response = await axiosInstance.get(`/reviews`, {
      params: {
        "filters[product][id][$eq]": productId,
        populate: ["users_permissions_user", "product"],
      },
    });
    console.log("Fetched Reviews:", response.data.results);
    return response.data.results || [];
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch reviews";
    console.error("Error fetching reviews:", errorMessage);
    throw new Error(errorMessage);
    return [];
  }
};
