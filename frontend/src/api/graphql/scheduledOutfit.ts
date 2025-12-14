export const SCHEDULED_OUTFITS_QUERY = `
  query ScheduledOutfits {
    scheduledOutfits {
      schedule_id
      user_id
      outfit_id
      schedule_date
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

export const SCHEDULED_OUTFITS_BY_USER_QUERY = `
  query ScheduledOutfitsByUser($userId: Int!) {
    scheduledOutfitsByUser(userId: $userId) {
      schedule_id
      user_id
      outfit_id
      schedule_date
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

export const SCHEDULED_OUTFIT_QUERY = `
  query ScheduledOutfit($id: Int!) {
    scheduledOutfit(id: $id) {
      schedule_id
      user_id
      outfit_id
      schedule_date
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

export const CREATE_SCHEDULED_OUTFIT_MUTATION = `
  mutation CreateScheduledOutfit($input: CreateScheduledOutfitInput!) {
    createScheduledOutfit(createScheduledOutfitInput: $input) {
      schedule_id
      user_id
      outfit_id
      schedule_date
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

export const UPDATE_SCHEDULED_OUTFIT_MUTATION = `
  mutation UpdateScheduledOutfit($input: UpdateScheduledOutfitInput!) {
    updateScheduledOutfit(updateScheduledOutfitInput: $input) {
      schedule_id
      user_id
      outfit_id
      schedule_date
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

export const DELETE_SCHEDULED_OUTFIT_MUTATION = `
  mutation DeleteScheduledOutfit($id: Int!) {
    deleteScheduledOutfit(id: $id) {
      message
    }
  }
`;
