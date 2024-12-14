let filterTopics = [];

// Retrieve the user-defined topics from chrome.storage
chrome.storage.local.get("filterTopics", (data) => {
  console.log("Stored topics retrieved from storage:", data);
  if (data.filterTopics && Array.isArray(data.filterTopics)) {
    filterTopics = data.filterTopics;
    console.log("Filter topics to hide unrelated videos:", filterTopics);
    hideUnrelatedVideos();
    observeDynamicChanges(); // Start observing dynamic changes
  } else {
    console.log("No filter topics found in storage.");
  }
});

// Function to hide unrelated videos
function hideUnrelatedVideos() {
  console.log("Running hideUnrelatedVideos...");

  const videoContainers = document.querySelectorAll("ytd-rich-item-renderer, style-scope");
  console.log("Total video containers found:", videoContainers.length);

  videoContainers.forEach((container) => {
    const titleElement = container.querySelector("#video-title");
    const channelElement = container.querySelector(
      "a.yt-simple-endpoint.style-scope.yt-formatted-string"
    );

    const titleText = titleElement?.textContent?.trim().toLowerCase() || "";
    const channelText = channelElement?.textContent?.trim().toLowerCase() || "";

    // Check if any topic matches either the title or the channel name
    const matchesTopic = filterTopics.some(
      (topic) => titleText.includes(topic) || channelText.includes(topic)
    );

    if (!matchesTopic) {
      console.log("Hiding video - Title:", titleText, ", Channel:", channelText);
      container.style.display = "none";
    } else {
      console.log("Keeping video - Title:", titleText, ", Channel:", channelText);
    }
  });
}

// Function to observe dynamically loaded content
function observeDynamicChanges() {
  const observer = new MutationObserver(() => {
    console.log("DOM changed - running hideUnrelatedVideos...");
    hideUnrelatedVideos();
  });

  const targetNode = document.querySelector("ytd-rich-grid-renderer") || document.body;
  observer.observe(targetNode, { childList: true, subtree: true });

  console.log("Started observing DOM changes...");
}
