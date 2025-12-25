
document.addEventListener("DOMContentLoaded", function() {
  const BATCH_SIZE = 4;
  const INITIAL_COUNT = 4;
  let visibleCount = INITIAL_COUNT;

  // Select all gallery columns (items are inside these columns)
  const gallerySection = document.getElementById('gallery');
  if (!gallerySection) return;

  const galleryItems = gallerySection.querySelectorAll('.container-fluid .row .col-lg-3');
  const loadMoreBtn = document.getElementById('load-more-gallery');
  const showLessBtn = document.getElementById('show-less-gallery');

  // Initial Function to refresh visibility based on count
  function updateGalleryVisibility() {
    galleryItems.forEach((item, index) => {
      if (index < visibleCount) {
        item.style.display = 'block';
        item.classList.add('animate__animated', 'animate__fadeIn');
      } else {
        item.style.display = 'none';
      }
    });

    // Button Visibility Logic
    if (loadMoreBtn) {
      // If we are showing all items, hide "Load More"
      if (visibleCount >= galleryItems.length) {
        loadMoreBtn.style.display = 'none';
      } else {
        loadMoreBtn.style.display = 'inline-block';
      }
    }

    if (showLessBtn) {
      // If we are showing more than initial, show "Show Less"
      if (visibleCount > INITIAL_COUNT) {
        showLessBtn.style.display = 'inline-block';
      } else {
        showLessBtn.style.display = 'none';
      }
    }
  }

  // Run initial check
  if (galleryItems.length > 0) {
    updateGalleryVisibility();
  }

  // Load More Handler
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
      visibleCount += BATCH_SIZE;
      updateGalleryVisibility();
    });
  }

  // Show Less Handler
  if (showLessBtn) {
    showLessBtn.addEventListener('click', function() {
      visibleCount = INITIAL_COUNT;
      // Scroll back to gallery top smoothly
      gallerySection.scrollIntoView({ behavior: 'smooth' });
      updateGalleryVisibility();
    });
  }
});
