const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface Review {
  id: string;
  content: string;
  rating: number;
  userId: string | null;
  spaceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Space {
  id: string;
  name: string;
  description: string | null;
  location: string;
  price: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  reviews?: Review[];
}

export interface NewReviewInput {
  rating: number;
  comment: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new Error(message || `Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const getSpaces = (): Promise<Space[]> =>
  fetch(`${API_BASE_URL}/spaces`, {
    credentials: "include",
  }).then((r) => handleResponse<Space[]>(r));

export const getSpace = (id: string): Promise<Space> =>
  fetch(`${API_BASE_URL}/spaces/${id}`, {
    credentials: "include",
  }).then((r) => handleResponse<Space>(r));

export const submitReview = (
  spaceId: string,
  input: NewReviewInput,
  token: string,
): Promise<Review> =>
  fetch(`${API_BASE_URL}/spaces/${spaceId}/reviews`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  }).then((r) => handleResponse<Review>(r));
