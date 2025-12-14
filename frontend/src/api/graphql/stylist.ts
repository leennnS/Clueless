export const ASK_STYLIST_MUTATION = `
  mutation AskStylist($input: StylistInput!) {
    askStylist(input: $input) {
      messages {
        sender
        text
      }
      outfits {
        name
        reasoning
        items {
          itemId
          reason
        }
      }
      shoppingSuggestions {
        category
        reason
      }
    }
  }
`;
