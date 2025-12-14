export const USERS_QUERY = `
  query Users {
    users {
      user_id
      username
      email
      profile_image_url
    }
  }
`;

export const USER_QUERY = `
  query User($id: Int!) {
    user(id: $id) {
      user_id
      username
      email
      profile_image_url
      clothing_items {
        item_id
        name
        category
        color
        image_url
        uploaded_at
        updated_at
        tags {
          tag_id
          name
        }
      }
    }
  }
`;

export const WARDROBE_SUMMARY_QUERY = `
  query WardrobeSummary($userId: Int!) {
    wardrobeSummary(userId: $userId) {
      favorites
      total_items
      total_outfits
      latest_items {
        item_id
        name
        category
        color
        image_url
      }
      latest_outfits {
        outfit_id
        name
        cover_image_url
        is_public
      }
      favorite_colors {
        color
        count
      }
      top_tags {
        tag
        count
      }
      most_worn_item {
        item_id
        name
        category
        color
        image_url
        wear_count
      }
    }
  }
`;

export const UPDATE_USER_MUTATION = `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(updateUserInput: $input) {
      message
      user {
        user_id
        username
        email
        profile_image_url
      }
    }
  }
`;

export const DELETE_USER_MUTATION = `
  mutation DeleteUser($id: Int!) {
    deleteUser(id: $id) {
      message
    }
  }
`;
