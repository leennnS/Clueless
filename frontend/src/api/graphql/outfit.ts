export const OUTFITS_QUERY = `
  query Outfits {
    outfits {
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
      like_count
      comment_count
      liked_by_viewer
    }
  }
`;

export const OUTFIT_QUERY = `
  query Outfit($id: Int!) {
    outfit(id: $id) {
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
      like_count
      comment_count
      liked_by_viewer
    }
  }
`;

export const OUTFITS_BY_USER_QUERY = `
  query OutfitsByUser($userId: Int!) {
    outfitsByUser(userId: $userId) {
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
`;

export const PUBLIC_OUTFIT_FEED_QUERY = `
  query PublicOutfitFeed($search: String, $viewerId: Int) {
    publicOutfitFeed(search: $search, viewerId: $viewerId) {
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
      like_count
      comment_count
      liked_by_viewer
    }
  }
`;

export const CREATE_OUTFIT_MUTATION = `
  mutation CreateOutfit($input: CreateOutfitInput!) {
    createOutfit(createOutfitInput: $input) {
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
`;

export const UPDATE_OUTFIT_MUTATION = `
  mutation UpdateOutfit($input: UpdateOutfitInput!) {
    updateOutfit(updateOutfitInput: $input) {
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
`;

export const DELETE_OUTFIT_MUTATION = `
  mutation DeleteOutfit($id: Int!) {
    deleteOutfit(id: $id) {
      message
    }
  }
`;
