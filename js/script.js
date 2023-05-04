"use strict";

//MENU

const menuBlock = document.querySelector(".menu_block");
const burgerBtn = document.querySelector(".burger_btn");
const menu = document.querySelector(".menu");

function butgerBtnAction() {
  menuBlock.classList.toggle("active");
}

burgerBtn.addEventListener("click", butgerBtnAction);

function closeMenuAfterClickMenuLink(event) {
  if (!menuBlock.classList.contains("active")) {
    return;
  }
  let target = event.target.closest("a");
  if (target) {
    menuBlock.classList.remove("active");
  }
}

menuBlock.addEventListener("click", closeMenuAfterClickMenuLink);

//MENU LINE STICKY EFFECT

let logoMenuBlockWrapper = document.querySelector(
  ".page_logo_menu_block_wrapper"
);
let logoMenuBlock = document.querySelector(".page_logo_menu_block");
let header = document.querySelector(".header");
let stickyPoint = header.getBoundingClientRect().bottom + window.pageYOffset;
let logoMenuWrapperHight = logoMenuBlockWrapper.getBoundingClientRect().height;

console.log(stickyPoint + "target");

function changeLogoMenuBlockPosition() {
  let pageScrollValue = window.pageYOffset;

  if (
    pageScrollValue >= stickyPoint &&
    !logoMenuBlock.classList.contains("active")
  ) {
    logoMenuBlock.classList.add("active");
    logoMenuBlockWrapper.style.height = logoMenuWrapperHight + "px";
  } else if (
    pageScrollValue < stickyPoint &&
    logoMenuBlock.classList.contains("active")
  ) {
    logoMenuBlock.classList.remove("active");
    logoMenuBlockWrapper.style.height = "";
  }
}

function resizePageCorrection() {
  stickyPoint = header.getBoundingClientRect().bottom + window.pageYOffset;
  logoMenuWrapperHight = logoMenuBlockWrapper.getBoundingClientRect().height;
  setMenuHeight();
}

function setMenuHeight() {
  let maxHeight = document.documentElement.offsetHeight - logoMenuWrapperHight;

  menu.style.maxHeight = maxHeight + "px";
}

setMenuHeight();

window.addEventListener("scroll", changeLogoMenuBlockPosition);
window.addEventListener("resize", resizePageCorrection);

// OBSERVER

let itemsForObserver = document.querySelectorAll("[data-onderver]");
let counters = document.querySelectorAll(".counter");
let graphics = document.querySelectorAll(".skill_graphic_value");

let options = {
  root: null,
  threshold: 0.3,
};

let observer = new IntersectionObserver((entries, observer) => {
  if (entries.length) {
    entries.forEach((entry) => {
      let target = entry.target;
      if (entry.isIntersecting) {
        if (target.classList.contains("counter")) {
          activeCounter(target);
          observer.unobserve(target);
        } else if (target.classList.contains("skill_graphic_value")) {
          setGraphicsValue(target);
          observer.unobserve(target);
        }
      }
    });
  }
}, options);

function activeCounter(item) {
  let targetValue = parseFloat(item.textContent);
  let duration = item.dataset.duration ? item.dataset.duration : 1500;
  let startTime = Date.now();
  let currentValue = 0;

  function step() {
    let currentTiming = Date.now() - startTime;
    currentValue =
      currentTiming < duration
        ? Math.round((currentTiming / duration) * targetValue)
        : targetValue;

    item.textContent = currentValue;

    if (currentValue < targetValue) {
      window.requestAnimationFrame(step);
    }
  }
  window.requestAnimationFrame(step);
}

function setGraphicsValue(item) {
  let value = item.dataset.graphicValue ? item.dataset.graphicValue : 0;

  item.style.width = value;
}

if (counters.length) {
  counters.forEach((item) => {
    observer.observe(item);
  });
}

if (graphics.length) {
  graphics.forEach((item) => {
    observer.observe(item);
  });
}

let observtngBlocks = document.querySelectorAll("[data-observing_block]");

let options2 = {
  root: null,
  threshold: 0.1,
};

let observerForBlocks = new IntersectionObserver(
  (entries, observerForBlocks) => {
    if (entries.length) {
      entries.forEach((entry) => {
        let target = entry.target;

        if (entry.isIntersecting) {
          let timeLag = 150;
          let targets = target.querySelectorAll("[data-observing-item]");

          for (let item of targets) {
            setTimeout(() => {
              if (!item.classList.contains("active")) {
                item.classList.add("active");
              }
            }, timeLag);

            timeLag += 150;
          }
          observerForBlocks.unobserve(target);
        }
      });
    }
  },
  options2
);

if (observtngBlocks.length) {
  observtngBlocks.forEach((item) => {
    observerForBlocks.observe(item);
  });
}

//VIDEO POPAP

const playVideoBtn = document.querySelector(".header_play_btn");
const closeVideoPopapBtn = document.querySelector(".popap_video_close_btn");

function changePopapVisibility() {
  const videoPopap = document.querySelector(".page_popap");
  videoPopap.classList.toggle("active");
  setPageOverflowSize();
}

function closeVideoPopap() {
  changePopapVisibility();
  // let video = document.querySelector(".video_frame");
  // video.src = video.src;
}

playVideoBtn.addEventListener("click", changePopapVisibility);
closeVideoPopapBtn.addEventListener("click", closeVideoPopap);

function setPageOverflowSize() {
  let padding = window.innerWidth - document.documentElement.clientWidth;

  let body = document.querySelector("body");

  if (!body.style.paddingRight) {
    body.style.paddingRight = padding + "px";
    body.style.overflow = "hidden";
  } else {
    body.style.paddingRight = "";
    body.style.overflow = "";
  }
}

// PAGE CLIENT SLIDER

const clientSlider = document.querySelector(".client_slider");
const clientSliderLine = document.querySelector(".client_slider_line");
let clientSliderAnimationDuration =
  parseFloat(getComputedStyle(clientSliderLine).transitionDuration) * 1000;

let clientSlides = document.querySelectorAll(".client_slider_slide");
let cloneClientSlides = [];

for (let slide of clientSlides) {
  let clone = slide.cloneNode(true);
  cloneClientSlides.push(clone);
}

let clientSlideIndex = 0;
let clientSliderInterval = null;

function moveClientSlider() {
  clientSlider.removeEventListener("pointerdown", touchMoveClientSliger);

  clientSlides = document.querySelectorAll(".client_slider_slide");

  let slideWidth = clientSlides[0].offsetWidth;
  let delay = clientSliderAnimationDuration
    ? clientSliderAnimationDuration
    : 500;
  let slidesForEdit = [];

  for (let slide of cloneClientSlides) {
    let clone = slide.cloneNode(true);
    slidesForEdit.push(clone);
  }

  if (clientSliderLine.classList.contains("active")) {
    clientSliderLine.classList.remove("active");
  }

  clientSliderLine.append(slidesForEdit[clientSlideIndex]);

  if (clientSlideIndex < cloneClientSlides.length - 1) {
    clientSlideIndex++;
  } else {
    clientSlideIndex = 0;
  }

  clientSliderLine.style.transform = `translateX(-${slideWidth + "px"})`;

  setTimeout(() => {
    if (!clientSliderLine.classList.contains("active")) {
      clientSliderLine.classList.add("active");
    }
    clientSlides = document.querySelectorAll(".client_slider_slide");

    clientSlides[0].remove();
    clientSliderLine.style.transform = ``;
    clientSlider.addEventListener("pointerdown", touchMoveClientSliger);
  }, delay);
}

clientSliderInterval = setInterval(moveClientSlider, 5000);

function reversMoveClientSlider() {
  clientSlider.removeEventListener("pointerdown", touchMoveClientSliger);

  clientSlides = document.querySelectorAll(".client_slider_slide");

  let slideWidth = clientSlides[0].offsetWidth;
  let delay = clientSliderAnimationDuration
    ? clientSliderAnimationDuration
    : 500;
  let slidesForEdit = [];

  for (let slide of cloneClientSlides) {
    let clone = slide.cloneNode(true);
    slidesForEdit.push(clone);
  }
  let shiftValueForCS = null;
  let startSliderShift = clientSliderLine.style.transform;
  shiftValueForCS = startSliderShift.match(regExpForCS)[0];

  if (!clientSliderLine.classList.contains("active")) {
    clientSliderLine.classList.add("active");
  }

  if (clientSlideIndex > 0) {
    clientSlideIndex--;
  } else {
    clientSlideIndex = cloneClientSlides.length - 1;
  }

  clientSliderLine.prepend(slidesForEdit[clientSlideIndex]);

  clientSliderLine.style.transform = `translateX(-${
    slideWidth - +shiftValueForCS + "px"
  })`;

  setTimeout(() => {
    if (clientSliderLine.classList.contains("active")) {
      clientSliderLine.classList.remove("active");
    }
    clientSliderLine.style.transform = "";
  }, 20);

  setTimeout(() => {
    clientSlides = document.querySelectorAll(".client_slider_slide");

    clientSlides[clientSlides.length - 1].remove();
    clientSlider.addEventListener("pointerdown", touchMoveClientSliger);
  }, delay);
}

console.log(-10 + -2);

let startPointCS = null;
let posX1ForCS = null;
let posX2ForCS = null;
let regExpForCS = /[-0-9.]+(?=px)/;
let shiftValueForCS = null;

function touchMoveClientSliger(event) {
  if (!event.isPrimary) {
    return;
  }
  clearInterval(clientSliderInterval);

  clientSlides = document.querySelectorAll(".client_slider_slide");

  for (let slide of clientSliderLine.querySelectorAll("img")) {
    slide.ondragstart = () => {
      return false;
    };
  }
  startPointCS = event.clientX;
  posX1ForCS = posX2ForCS = startPointCS;
  clientSliderLine.style.transform = `translateX(0px)`;

  document.addEventListener("pointermove", poolClientSlider);
  document.addEventListener("pointerup", endPoolClientSlider);
}

function poolClientSlider(event) {
  if (!clientSliderLine.classList.contains("active")) {
    clientSliderLine.classList.add("active");
  }

  posX2ForCS = event.clientX;
  let shift = posX2ForCS - posX1ForCS;
  posX1ForCS = posX2ForCS;
  let startSliderShift = clientSliderLine.style.transform;
  shiftValueForCS = startSliderShift.match(regExpForCS)[0];

  clientSliderLine.style.transform = `translateX(${
    +shiftValueForCS + shift + "px"
  })`;
}

function endPoolClientSlider() {
  document.removeEventListener("pointermove", poolClientSlider);
  document.removeEventListener("pointerup", endPoolClientSlider);
  correctClienSlider();
}

function correctClienSlider() {
  let shiftValue = Math.abs(startPointCS - posX2ForCS);
  let correctFunction = null;
  if (shiftValue < 5) {
    if (clientSliderLine.classList.contains("active")) {
      clientSliderLine.classList.remove("active");
    }
    clientSliderLine.style.transform = `translateX(0px)`;
  } else {
    correctFunction =
      startPointCS > posX2ForCS ? moveClientSlider : reversMoveClientSlider;
    correctFunction();
  }
}

clientSlider.addEventListener("pointerdown", touchMoveClientSliger);

//POSTS CART SLIDER

const postsContainer = document.querySelector(".page_posts_grid");

postsContainer.addEventListener("pointerover", initPostCart);
let postsSliderInterval = null;

function initPostCart(event) {
  let target = event.target.closest(".post_slider");

  if (!target) {
    return;
  }

  let sliderLIne = target.querySelector(".page_posts_item_slider_line");
  let slides = target.querySelectorAll(".page_posts_item_slide");

  console.log(slides.length);
  let cloneSlides = [];

  for (let slide of slides) {
    let clone = slide.cloneNode(true);
    cloneSlides.push(clone);
  }

  let sliderAnimationDuration =
    parseFloat(getComputedStyle(sliderLIne).transitionDuration) * 1000;
  let delay = sliderAnimationDuration ? sliderAnimationDuration : 500;
  let slideIndex = 0;

  function movePostsSlider() {
    if (sliderLIne.classList.contains("active")) {
      sliderLIne.classList.remove("active");
    }

    let slidesForEdit = [];

    for (let slide of cloneSlides) {
      let clone = slide.cloneNode(true);
      slidesForEdit.push(clone);
    }
    slides = target.querySelectorAll(".page_posts_item_slide");

    let slideWidth = slides[0].offsetWidth;

    sliderLIne.append(slidesForEdit[slideIndex]);

    if (slideIndex < cloneSlides.length - 1) {
      slideIndex++;
    } else {
      slideIndex = 0;
    }

    sliderLIne.style.transform = `translateX(-${slideWidth + "px"})`;

    setTimeout(() => {
      if (!sliderLIne.classList.contains("active")) {
        sliderLIne.classList.add("active");
      }
      slides = target.querySelectorAll(".page_posts_item_slide");

      slides[0].remove();
      sliderLIne.style.transform = ``;
    }, delay);
  }

  if (!postsSliderInterval) {
    postsSliderInterval = setInterval(movePostsSlider, 3000);
  }

  function stopPostsSlider(event) {
    let relatedTarget = event.relatedTarget;
    let currentTarget = relatedTarget;

    while (currentTarget) {
      if (currentTarget !== target) {
        currentTarget = currentTarget.parentNode;
      } else {
        return;
      }
    }

    clearInterval(postsSliderInterval);
    postsSliderInterval = null;
    target.removeEventListener("pointerout", stopPostsSlider);
  }

  target.addEventListener("pointerout", stopPostsSlider);
}

//WORKS SECTION FILTER

const worksBtnsContainer = document.querySelector(".page_works_btns");
let worksBtns = document.querySelectorAll(".page_works_btn");

let worksItems = document.querySelectorAll(".page_works_grid_item");

function setActiveWorksBtn(target) {
  worksBtns.forEach((item) => {
    if (item === target && item.classList.contains("active")) {
      return;
    } else if (item === target && !item.classList.contains("active")) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

function filterWorksItems(target) {
  let filterEtalon = target.dataset.filter;

  if (filterEtalon && worksItems.length) {
    for (let item of worksItems) {
      let filterValue = item.dataset.filter;

      if (
        filterValue !== filterEtalon &&
        !item.classList.contains("invisible") &&
        filterEtalon !== "*"
      ) {
        let width = item.offsetWidth;
        let height = item.offsetHeight;

        item.style.width = width + "px";
        item.style.height = height + "px";

        setTimeout(() => {
          item.style.width = "0px";
          item.style.height = "0px";
          item.classList.add("invisible");
        }, 0);

        setTimeout(() => {
          // item.hidden = true;
          item.style.display = "none";
          // item.style.width = "";
          // item.style.height = "";
        }, 500);
      } else if (
        filterValue === filterEtalon &&
        item.classList.contains("invisible")
      ) {
        // item.hidden = false;
        item.style.width = "";
        item.style.height = "";
        item.style.display = "";

        let width = item.offsetWidth;
        let height = item.offsetHeight;
        // item.hidden = true;
        item.style.display = "none";

        item.style.width = "0px";
        item.style.height = "0px";

        setTimeout(() => {
          // item.hidden = false;
          item.style.display = "";

          setTimeout(() => {
            item.style.width = width + "px";
            item.style.height = height + "px";
          }, 10);
        }, 0);

        setTimeout(() => {
          item.style.width = "";
          item.style.height = "";
          item.classList.remove("invisible");
        }, 510);
      } else if (filterEtalon === "*" && item.classList.contains("invisible")) {
        item.style.width = "";
        item.style.height = "";
        item.style.display = "";

        let width = item.offsetWidth;
        let height = item.offsetHeight;
        // item.hidden = true;
        item.style.display = "none";

        item.style.width = "0px";
        item.style.height = "0px";

        setTimeout(() => {
          // item.hidden = false;
          item.style.display = "";

          setTimeout(() => {
            item.style.width = width + "px";
            item.style.height = height + "px";
          }, 10);
        }, 0);

        setTimeout(() => {
          item.style.width = "";
          item.style.height = "";
          item.classList.remove("invisible");
        }, 510);
      }
    }
  }
}

function worksBtnAction(target) {
  setActiveWorksBtn(target);
  filterWorksItems(target);
}

function initWorksBtnForAction(event) {
  let target = event.target.closest(".page_works_btn");

  if (!target) {
    return;
  }

  worksBtnAction(target);

  event.preventDefault();
}

worksBtnsContainer.addEventListener("click", initWorksBtnForAction);
