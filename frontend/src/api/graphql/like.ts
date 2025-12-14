export const LIKES_QUERY = `
  query Likes {
    likes {
      like_id
      created_at
      user {
        user_id
        username
        email
        profile_image_url
      }
      outfit {
        outfit_id
        name
        is_public
        cover_image_url
        user_id
        created_at
        updated_at
        user {
          user_id
          username
          email
          profile_image_url
        }
      }
    }
  }
`;

export const LIKE_QUERY = `
  query Like($id: Int!) {
    like(id: $id) {
      like_id
      created_at
      user {
        user_id
        username
        email
        profile_image_url
      }
      outfit {
        outfit_id
        name
        is_public
        cover_image_url
        user_id
        created_at
        updated_at
        user {
          user_id
          username
          email
          profile_image_url
        }
      }
    }
  }
`;

export const LIKES_BY_USER_QUERY = `
  query LikesByUser($userId: Int!) {
    likesByUser(userId: $userId) {
      like_id
      created_at
      user {
        user_id
        username
        email
        profile_image_url
      }
      outfit {
        outfit_id
        name
        is_public
        cover_image_url
        user_id
        created_at
        updated_at
        user {
          user_id
          username
          email
          profile_image_url
        }
      }
    }
  }
`;

export const LIKES_FOR_CREATOR_QUERY = `
  query LikesForCreator($creatorId: Int!) {
    likesForCreator(creatorId: $creatorId) {
      like_id
      created_at
      user {
        user_id
        username
        email
        profile_image_url
      }
      outfit {
        outfit_id
        name
        is_public
        cover_image_url
        user_id
        created_at
        updated_at
        user {
          user_id
          username
          email
          profile_image_url
        }
      }
    }
  }
`;

export const LIKE_OUTFIT_MUTATION = `
  mutation LikeOutfit($input: CreateLikeInput!) {
    likeOutfit(createLikeInput: $input) {
      like_id
      created_at
      user {
        user_id
        username
        email
        profile_image_url
      }
      outfit {
        outfit_id
        name
        is_public
        cover_image_url
        user_id
        created_at
        updated_at
        user {
          user_id
          username
          email
          profile_image_url
        }
      }
    }
  }
`;

export const TOGGLE_LIKE_MUTATION = `
  mutation ToggleLike($input: CreateLikeInput!) {
    toggleLike(createLikeInput: $input) {
      like_id
      created_at
      user {
        user_id
        username
        email
        profile_image_url
      }
      outfit {
        outfit_id
        name
        is_public
        cover_image_url
        user_id
        created_at
        updated_at
        user {
          user_id
          username
          email
          profile_image_url
        }
      }
    }
  }
`;

export const DELETE_LIKE_MUTATION = `
  mutation DeleteLike($id: Int!) {
    deleteLike(id: $id) {
      message
    }
  }
`;
