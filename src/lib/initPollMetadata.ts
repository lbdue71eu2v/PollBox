// Initialize poll metadata in localStorage
// This should be run once to set up the metadata for the 4 created polls

export const initializePollMetadata = () => {
  const pollMetadata = {
    "0x1cb4387a5b8672e82e7192300239e0b19c18fbd5368152773f78cb399713ec48": {
      "title": "Should we implement dark mode?",
      "description": "Vote on whether the platform should support dark mode theme for better user experience. This would involve redesigning all components to support both light and dark themes.",
      "createdAt": 1761809297756
    },
    "0x1d4494de4b76555aadba07740d43de1914b541ab7187771e47d0ee03042696ab": {
      "title": "Approve new governance proposal",
      "description": "Community vote on the latest governance changes for the protocol. This includes updates to voting parameters and treasury management.",
      "createdAt": 1761809306140
    },
    "0xbe0db7f4011a7f552749ec147d5cd03b19f862b8fbd4af8b21caafaf9fd54e60": {
      "title": "Increase transaction fees?",
      "description": "Proposal to adjust network fees to improve infrastructure maintenance and sustainability of the platform.",
      "createdAt": 1761809321180
    },
    "0x541c70824798f93da8f83259215d0038c81a0c7ffd07cf277cb26e1acb46a727": {
      "title": "Add multi-language support",
      "description": "Should we add support for multiple languages including Spanish, French, Chinese, and Japanese to make the platform more accessible globally?",
      "createdAt": 1761809332239
    }
  };

  localStorage.setItem("pollMetadata", JSON.stringify(pollMetadata));
  console.log("✅ Poll metadata initialized");
};
