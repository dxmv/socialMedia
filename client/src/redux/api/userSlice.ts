import { User } from "../../types";
import { apiSlice } from "./apiSlice";

export const userApi = apiSlice.injectEndpoints({
	endpoints: build => ({
		login: build.mutation<
			{ token: string; id: string },
			{ username: string; password: string }
		>({
			query: user => ({
				url: "/login",
				method: "POST",
				body: user,
			}),
		}),
		// Get queries
		getUserById: build.query<User, { id: string }>({
			query: ({ id }) => ({
				url: `/users/${id}`,
			}),
		}),
		getCurrentUser: build.query<User, void>({
			query: () => ({
				url: "/users/current/",
			}),
		}),
		// Mutations
		registerUser: build.mutation<
			User,
			{
				username: string;
				email: string;
				image: string;
				password: string;
				bio: string;
			}
		>({
			query: body => ({
				url: "/users/",
				method: "POST",
				body: body,
			}),
		}),
		changeUserInfo: build.mutation<
			User,
			{ username: string; email: string; bio: string; token: string }
		>({
			query: user => ({
				url: `/users/`,
				method: "PUT",
				headers: {
					authenticate: `${user.token}`,
				},
				body: {
					username: user.username,
					email: user.email,
					bio: user.bio,
				},
			}),
		}),
		changeUserImage: build.mutation<User, FormData>({
			query: body => ({
				url: `/profilePicture/`,
				method: "PATCH",
				body: body,
			}),
		}),
		followUser: build.mutation<User, { followId: string; token: string }>({
			query: body => ({
				url: `/users/follow/${body.followId}`,
				method: "PATCH",
				headers: {
					authenticate: `${body.token}`,
				},
			}),
		}),
		unfollowUser: build.mutation<User, { followId: string; token: string }>({
			query: body => ({
				url: `/users/unfollow/${body.followId}`,
				method: "PATCH",
				headers: {
					authenticate: `${body.token}`,
				},
			}),
		}),
	}),
	overrideExisting: false,
});

export const {
	useLoginMutation,
	useGetUserByIdQuery,
	useLazyGetUserByIdQuery,
	useLazyGetCurrentUserQuery,
	useChangeUserImageMutation,
} = userApi;
