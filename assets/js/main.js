/**
 * Madame Gown (มาดามเกาวน์)
 * สตูดิโอตัดเย็บชุดครุยวิทยฐานะและสูทสั่งตัดชั้นสูง ประสบการณ์กว่า 15 ปี
 * Vanilla JavaScript Architecture
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initProductCatalog();
  initBookingModal();
  initProductDetailModal();
  initStatsObserver();
  initSizeCalculator();
  initWelcomeCoupon();
  initGalleryMarquee();
  initGownOnlyHoverPan();
  initFloatingOrderButton();
});

/* -------------------------------------------------------------------------- */
/* 1. Mobile Navigation Drawer                                                */
/* -------------------------------------------------------------------------- */
function initMobileNav() {
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const closeMenuBtn = document.getElementById('close-menu-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuToggleBtn || !mobileNavDrawer) return;

  function openMobileNav() {
    mobileNavDrawer.classList.remove('translate-x-full');
    mobileNavOverlay.classList.remove('opacity-0', 'pointer-events-none');
    mobileNavOverlay.classList.add('opacity-100', 'pointer-events-auto');
    document.body.classList.add('overflow-hidden');
    menuToggleBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMobileNav() {
    mobileNavDrawer.classList.add('translate-x-full');
    mobileNavOverlay.classList.remove('opacity-100', 'pointer-events-auto');
    mobileNavOverlay.classList.add('opacity-0', 'pointer-events-none');
    document.body.classList.remove('overflow-hidden');
    menuToggleBtn.setAttribute('aria-expanded', 'false');
  }

  menuToggleBtn.addEventListener('click', openMobileNav);
  if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMobileNav);
  if (mobileNavOverlay) mobileNavOverlay.addEventListener('click', closeMobileNav);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });
}

/* -------------------------------------------------------------------------- */
/* 2. Product Catalog Filtering & Interactive Configurators                   */
/* -------------------------------------------------------------------------- */
function initProductCatalog() {
  const filterBtns = document.querySelectorAll('.catalog-filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  // Filter Buttons Handling
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedCategory = btn.getAttribute('data-filter');

      // Update active button state styling
      filterBtns.forEach(b => {
        b.classList.remove('bg-olive-mist', 'text-white', 'border-olive-mist');
        b.classList.add('bg-transparent', 'text-smoky-clay', 'border-mushroom-taupe/40');
      });

      btn.classList.add('bg-olive-mist', 'text-white', 'border-olive-mist');
      btn.classList.remove('bg-transparent', 'text-smoky-clay', 'border-mushroom-taupe/40');

      // Filter product cards
      productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (selectedCategory === 'all' || cardCategory === selectedCategory) {
          card.classList.remove('hidden');
          card.classList.add('animate-fade-in');
        } else {
          card.classList.add('hidden');
          card.classList.remove('animate-fade-in');
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // Card 1: Gown with Ribbon Image Mapping (11 Colors & Degrees)
  // --------------------------------------------------------------------------
  const GOWN_RIBBON_IMAGES = {
    // 11 Faculty Colors (Bachelor / Standard 1-tier white fur)
    "ฟ้า": "assets/images/products/gown_blue_closeup.jpg",
    "เขียว": "assets/images/products/gown_green_closeup.jpg",
    "เหลือง": "assets/images/products/gown_yellow_becherlor_closeup.jpg",
    "ส้ม": "assets/images/products/gown_orange_closeup.jpg",
    "ชมพูม่วง": "assets/images/products/gown_pink.jpg",
    "ม่วง": "assets/images/products/gown_purple.jpg",
    "แดงเลือดหมู": "assets/images/products/gown_red_closeup.jpg",
    "ขาว": "assets/images/products/gown_white_closeup.jpg",
    "เทาฟ้า": "assets/images/products/gown_greyblue_closeup.jpg",
    "เทาส้ม": "assets/images/products/gown_greyorange_closeup.jpg",
    "ฟ้าการบิน": "assets/images/products/gown_lightblue_closeup.jpg",

    // Master Degree (แถบสีมีขนสีขาว 2 ชั้น)
    "master_gold": "assets/images/products/gown_gold_becherlor_closeup.jpg",
    "master_green": "assets/images/products/gown_green_becherlor_closeup.jpg",

    // Doctor Degree (แถบสีมีขนสีขาว 3 ชั้น)
    "doctor_purple": "assets/images/products/gown_purple_dr_closeup.jpg",
    "doctor_white": "assets/images/products/gown_white_dr_closeup.jpg",

    // Full Mannequin Showcase
    "full_bachelor": "assets/images/products/gown_bachelor degree.jpg",
    "full_master": "assets/images/products/gown_Masterdegree.jpg",
    "full_doctor": "assets/images/products/gown_doctor degree.jpg"
  };

  const degreeBtns = document.querySelectorAll('.degree-btn');
  const gownRibbonImg = document.getElementById('card-gown-ribbon-img');
  const degreeBadge = document.getElementById('card-degree-badge');
  const cardDegreeFurDesc = document.getElementById('card-degree-fur-desc');
  const priceRentDisplay = document.getElementById('price-rent-display');
  const priceRentnewDisplay = document.getElementById('price-rentnew-display');
  const priceBuyDisplay = document.getElementById('price-buy-display');
  const gownColorSwatches = document.querySelectorAll('.gown-color-swatch');
  const gownColorLabel = document.getElementById('gown-selected-color-label');
  const gownShowFullModelBtn = document.getElementById('gown-show-fullmodel-btn');

  function updateGownCardDisplay(degree, color, directImg = null) {
    let targetImg = directImg;
    let furText = 'แถบสีมาตรฐาน (ขนขาว 1 ชั้น)';

    if (degree === 'ปริญญาโท') {
      furText = 'แถบสีมีขนสีขาว 2 ชั้น (+100บ.)';
      if (!targetImg) {
        if (color === 'เขียว') targetImg = GOWN_RIBBON_IMAGES.master_green;
        else if (color === 'เหลือง') targetImg = GOWN_RIBBON_IMAGES.master_gold;
        else targetImg = GOWN_RIBBON_IMAGES[color] || GOWN_RIBBON_IMAGES.full_master;
      }
    } else if (degree === 'ปริญญาเอก') {
      furText = 'แถบสีมีขนสีขาว 3 ชั้น (+150บ.)';
      if (!targetImg) {
        if (color === 'ม่วง') targetImg = GOWN_RIBBON_IMAGES.doctor_purple;
        else if (color === 'ขาว') targetImg = GOWN_RIBBON_IMAGES.doctor_white;
        else targetImg = GOWN_RIBBON_IMAGES[color] || GOWN_RIBBON_IMAGES.full_doctor;
      }
    } else {
      // ปริญญาตรี
      if (!targetImg) {
        targetImg = GOWN_RIBBON_IMAGES[color] || GOWN_RIBBON_IMAGES["ฟ้า"];
      }
    }

    if (gownRibbonImg && targetImg) {
      gownRibbonImg.style.opacity = '0.35';
      setTimeout(() => {
        gownRibbonImg.src = targetImg;
        gownRibbonImg.alt = `ชุดครุย พร้อมแถบสี${color} (${degree}) มาดามเกาวน์`;
        gownRibbonImg.style.opacity = '1';
      }, 150);
    }

    if (degreeBadge) degreeBadge.textContent = degree;
    if (cardDegreeFurDesc) cardDegreeFurDesc.textContent = furText;
  }

  // Degree Level Selection (ปริญญาตรี / ปริญญาโท / ปริญญาเอก)
  degreeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      degreeBtns.forEach(b => {
        b.classList.remove('bg-olive-mist', 'text-white', 'shadow-xs');
        b.classList.add('text-smoky-clay/75');
      });
      btn.classList.add('bg-olive-mist', 'text-white', 'shadow-xs');
      btn.classList.remove('text-smoky-clay/75');

      const degreeName = btn.getAttribute('data-degree');
      const rentPrice = btn.getAttribute('data-price-rent');
      const rentnewPrice = btn.getAttribute('data-price-rentnew');
      const buyPrice = btn.getAttribute('data-price-buy');

      if (priceRentDisplay) priceRentDisplay.textContent = `เช่า ${rentPrice}`;
      if (priceRentnewDisplay) priceRentnewDisplay.textContent = `เช่าตัด ${rentnewPrice}`;
      if (priceBuyDisplay) priceBuyDisplay.textContent = `ตัดใหม่ ${buyPrice}`;

      const cardServiceDropdown = document.getElementById('gown-with-ribbon-service');
      if (cardServiceDropdown) {
        if (degreeName === 'ปริญญาโท') {
          cardServiceDropdown.innerHTML = `
            <option value="เช่า" selected>เช่าครบชุด — รวม ฿2,100 (ค่าเช่า ฿1,100 + มัดจำ ฿1,000 ได้คืนเมื่อนำชุดมาคืน)</option>
            <option value="เช่าตัดใหม่">เช่าตัดใหม่ — รวม ฿2,400 (ค่าเช่า ฿1,400 + มัดจำ ฿1,000 ได้คืนเมื่อนำชุดมาคืน)</option>
            <option value="ตัดใหม่">ตัดใหม่ครบชุด (เป็นเจ้าของ) — ฿2,400</option>
          `;
        } else if (degreeName === 'ปริญญาเอก') {
          cardServiceDropdown.innerHTML = `
            <option value="เช่า" selected>เช่าครบชุด — รวม ฿2,150 (ค่าเช่า ฿1,150 + มัดจำ ฿1,000 ได้คืนเมื่อนำชุดมาคืน)</option>
            <option value="เช่าตัดใหม่">เช่าตัดใหม่ — รวม ฿2,450 (ค่าเช่า ฿1,450 + มัดจำ ฿1,000 ได้คืนเมื่อนำชุดมาคืน)</option>
            <option value="ตัดใหม่">ตัดใหม่ครบชุด (เป็นเจ้าของ) — ฿2,450</option>
          `;
        } else {
          cardServiceDropdown.innerHTML = `
            <option value="เช่า" selected>เช่าครบชุด — รวม ฿2,000 (ค่าเช่า ฿1,000 + มัดจำ ฿1,000 ได้คืนเมื่อนำชุดมาคืน)</option>
            <option value="เช่าตัดใหม่">เช่าตัดใหม่ — รวม ฿2,300 (ค่าเช่า ฿1,300 + มัดจำ ฿1,000 ได้คืนเมื่อนำชุดมาคืน)</option>
            <option value="ตัดใหม่">ตัดใหม่ครบชุด (เป็นเจ้าของ) — ฿2,300</option>
          `;
        }
      }

      let degreeImg = GOWN_RIBBON_IMAGES.full_bachelor;
      if (degreeName === 'ปริญญาโท') degreeImg = GOWN_RIBBON_IMAGES.full_master;
      else if (degreeName === 'ปริญญาเอก') degreeImg = GOWN_RIBBON_IMAGES.full_doctor;

      const activeColor = document.querySelector('.gown-color-swatch.scale-110');
      const currentColor = activeColor ? activeColor.getAttribute('data-color') : 'ฟ้า';

      updateGownCardDisplay(degreeName, currentColor, degreeImg);
    });
  });

  // Card 1: 11 Color Swatches Selection for Gown with Ribbon
  gownColorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      gownColorSwatches.forEach(s => {
        s.classList.remove('ring-2', 'ring-offset-2', 'ring-olive-mist', 'scale-110');
        s.classList.add('opacity-85');
      });
      swatch.classList.add('ring-2', 'ring-offset-2', 'ring-olive-mist', 'scale-110');
      swatch.classList.remove('opacity-85');

      const colorName = swatch.getAttribute('data-color');
      if (gownColorLabel) {
        gownColorLabel.textContent = `สี${colorName}`;
      }

      const activeDegreeBtn = document.querySelector('#degree-selector-group .degree-btn.bg-olive-mist');
      const currentDegree = activeDegreeBtn ? activeDegreeBtn.getAttribute('data-degree') : 'ปริญญาตรี';

      updateGownCardDisplay(currentDegree, colorName);
    });
  });

  // Card 1: View Full Mannequin Model Button
  if (gownShowFullModelBtn) {
    gownShowFullModelBtn.addEventListener('click', () => {
      const activeDegreeBtn = document.querySelector('#degree-selector-group .degree-btn.bg-olive-mist');
      const currentDegree = activeDegreeBtn ? activeDegreeBtn.getAttribute('data-degree') : 'ปริญญาตรี';
      
      let fullImg = GOWN_RIBBON_IMAGES.full_bachelor;
      if (currentDegree === 'ปริญญาโท') fullImg = GOWN_RIBBON_IMAGES.full_master;
      else if (currentDegree === 'ปริญญาเอก') fullImg = GOWN_RIBBON_IMAGES.full_doctor;

      if (gownRibbonImg) {
        gownRibbonImg.style.opacity = '0.35';
        setTimeout(() => {
          gownRibbonImg.src = fullImg;
          gownRibbonImg.alt = `ชุดครุยวิทยฐานะ (${currentDegree}) ภาพหุ่นเต็มตัว`;
          gownRibbonImg.style.opacity = '1';
        }, 150);
      }
    });
  }

  // --------------------------------------------------------------------------
  // Card 4: Hood / Ribbon Only Close-up Mapping & Interactive Controls
  // --------------------------------------------------------------------------
  const RIBBON_CLOSEUP_IMAGES = {
    // Bachelor / General Color Close-ups (1 layer fur or standard band)
    "ฟ้า": "assets/images/products/gown_blue_closeup.jpg",
    "เขียว": "assets/images/products/gown_green_closeup.jpg",
    "เหลือง": "assets/images/products/gown_yellow_becherlor_closeup.jpg",
    "ส้ม": "assets/images/products/gown_orange_closeup.jpg",
    "ชมพูม่วง": "assets/images/products/Gown_closeup.jpg",
    "ม่วง": "assets/images/products/gown_purple_dr_closeup.jpg",
    "แดงเลือดหมู": "assets/images/products/gown_red_closeup.jpg",
    "ขาว": "assets/images/products/gown_white_closeup.jpg",
    "เทาฟ้า": "assets/images/products/gown_greyblue_closeup.jpg",
    "เทาส้ม": "assets/images/products/gown_greyorange_closeup.jpg",
    "ฟ้าการบิน": "assets/images/products/gown_lightblue_closeup.jpg",
    
    // Master Degree (แถบสีมีขนสีขาว 2 ชั้น)
    "master_gold": "assets/images/products/gown_gold_becherlor_closeup.jpg",
    "master_green": "assets/images/products/gown_green_becherlor_closeup.jpg",
    
    // Doctor Degree (แถบสีมีขนสีขาว 3 ชั้น)
    "doctor_purple": "assets/images/products/gown_purple_dr_closeup.jpg",
    "doctor_white": "assets/images/products/gown_white_dr_closeup.jpg"
  };

  const cardRibbonOnlyImg = document.getElementById('card-ribbon-only-img');
  const ribbonDegreeBtns = document.querySelectorAll('.ribbon-degree-btn');
  const ribbonDegreeBadge = document.getElementById('ribbon-only-degree-badge');
  const ribbonFurLevelBadge = document.getElementById('ribbon-fur-level-badge');
  const ribbonDegreeFurDesc = document.getElementById('ribbon-degree-fur-desc');
  const ribbonPriceRentDisplay = document.getElementById('ribbon-price-rent-display');
  const ribbonPriceRentnewDisplay = document.getElementById('ribbon-price-rentnew-display');
  const ribbonPriceBuyDisplay = document.getElementById('ribbon-price-buy-display');
  const ribbonOnlyServiceDropdown = document.getElementById('ribbon-only-service');
  const ribbonGalleryThumbs = document.querySelectorAll('.ribbon-gallery-thumb');
  const ribbonColorSwatches = document.querySelectorAll('.ribbon-color-swatch');
  const ribbonOnlyColorLabel = document.getElementById('ribbon-only-selected-color');

  function updateRibbonCardDisplay(degree, color, directImg = null) {
    let targetImg = directImg;
    let furText = 'ขนสีขาว 1 ชั้น (มาตรฐาน)';
    let badgeDegreeText = 'ปริญญาตรี (ขนขาว 1 ชั้น)';
    let furBadgeText = 'ขนขาว 1 ชั้น • ป.ตรี';

    if (degree === 'ปริญญาโท') {
      furText = 'ขนสีขาว 2 ชั้น (+100บ.)';
      badgeDegreeText = 'ปริญญาโท (ขนขาว 2 ชั้น)';
      furBadgeText = 'ขนขาว 2 ชั้น • ป.โท';
      if (!targetImg) {
        if (color === 'เขียว') targetImg = RIBBON_CLOSEUP_IMAGES.master_green;
        else if (color === 'เหลือง') targetImg = RIBBON_CLOSEUP_IMAGES.master_gold;
        else targetImg = RIBBON_CLOSEUP_IMAGES[color] || RIBBON_CLOSEUP_IMAGES.master_gold;
      }
    } else if (degree === 'ปริญญาเอก') {
      furText = 'ขนสีขาว 3 ชั้น (+150บ.)';
      badgeDegreeText = 'ปริญญาเอก (ขนขาว 3 ชั้น)';
      furBadgeText = 'ขนขาว 3 ชั้น • ป.เอก';
      if (!targetImg) {
        if (color === 'ขาว') targetImg = RIBBON_CLOSEUP_IMAGES.doctor_white;
        else if (color === 'ม่วง') targetImg = RIBBON_CLOSEUP_IMAGES.doctor_purple;
        else targetImg = RIBBON_CLOSEUP_IMAGES.doctor_purple;
      }
    } else {
      // Bachelor
      if (!targetImg) {
        targetImg = RIBBON_CLOSEUP_IMAGES[color] || RIBBON_CLOSEUP_IMAGES['ฟ้า'];
      }
    }

    if (cardRibbonOnlyImg && targetImg) {
      cardRibbonOnlyImg.style.opacity = '0.4';
      setTimeout(() => {
        cardRibbonOnlyImg.src = targetImg;
        cardRibbonOnlyImg.style.opacity = '1';
      }, 150);
    }

    if (ribbonDegreeBadge) ribbonDegreeBadge.textContent = badgeDegreeText;
    if (ribbonFurLevelBadge) ribbonFurLevelBadge.textContent = furBadgeText;
    if (ribbonDegreeFurDesc) ribbonDegreeFurDesc.textContent = furText;

    // Update Ribbon Service Dropdown and Pricing Displays
    if (degree === 'ปริญญาโท') {
      if (ribbonPriceRentDisplay) ribbonPriceRentDisplay.textContent = 'เช่า ฿600';
      if (ribbonPriceRentnewDisplay) ribbonPriceRentnewDisplay.textContent = 'เช่าตัด ฿700';
      if (ribbonPriceBuyDisplay) ribbonPriceBuyDisplay.textContent = 'ตัดใหม่ ฿750';
      if (ribbonOnlyServiceDropdown) {
        ribbonOnlyServiceDropdown.innerHTML = `
          <option value="เช่า" selected>เช่าแถบสีพร้อมโลโก้ (ป.โท) — รวม ฿600 (ค่าเช่า ฿300 + มัดจำ ฿300 ได้คืนเมื่อนำแถบมาคืน)</option>
          <option value="เช่าตัดใหม่">เช่าตัดใหม่แถบสีพร้อมโลโก้ (ป.โท) — รวม ฿700 (ค่าเช่า ฿350 + มัดจำ ฿350 ได้คืนเมื่อนำแถบมาคืน)</option>
          <option value="ตัดใหม่">ตัดแถบใหม่พร้อมโลโก้: ปริญญาโท (ขน 2 ชั้น) — ฿750</option>
        `;
      }
    } else if (degree === 'ปริญญาเอก') {
      if (ribbonPriceRentDisplay) ribbonPriceRentDisplay.textContent = 'เช่า ฿650';
      if (ribbonPriceRentnewDisplay) ribbonPriceRentnewDisplay.textContent = 'เช่าตัด ฿750';
      if (ribbonPriceBuyDisplay) ribbonPriceBuyDisplay.textContent = 'ตัดใหม่ ฿800';
      if (ribbonOnlyServiceDropdown) {
        ribbonOnlyServiceDropdown.innerHTML = `
          <option value="เช่า" selected>เช่าแถบสีพร้อมโลโก้ (ป.เอก) — รวม ฿650 (ค่าเช่า ฿350 + มัดจำ ฿300 ได้คืนเมื่อนำแถบมาคืน)</option>
          <option value="เช่าตัดใหม่">เช่าตัดใหม่แถบสีพร้อมโลโก้ (ป.เอก) — รวม ฿750 (ค่าเช่า ฿400 + มัดจำ ฿350 ได้คืนเมื่อนำแถบมาคืน)</option>
          <option value="ตัดใหม่">ตัดแถบใหม่พร้อมโลโก้: ปริญญาเอก (ขน 3 ชั้น) — ฿800</option>
        `;
      }
    } else {
      if (ribbonPriceRentDisplay) ribbonPriceRentDisplay.textContent = 'เช่า ฿500';
      if (ribbonPriceRentnewDisplay) ribbonPriceRentnewDisplay.textContent = 'เช่าตัด ฿600';
      if (ribbonPriceBuyDisplay) ribbonPriceBuyDisplay.textContent = 'ตัดใหม่ ฿650';
      if (ribbonOnlyServiceDropdown) {
        ribbonOnlyServiceDropdown.innerHTML = `
          <option value="เช่า" selected>เช่าแถบสีพร้อมโลโก้ — รวม ฿500 (ค่าเช่า ฿200 + มัดจำ ฿300 ได้คืนเมื่อนำแถบมาคืน)</option>
          <option value="เช่าตัดใหม่">เช่าตัดใหม่แถบสีพร้อมโลโก้ — รวม ฿600 (ค่าเช่า ฿250 + มัดจำ ฿350 ได้คืนเมื่อนำแถบมาคืน)</option>
          <option value="ตัดใหม่">ตัดแถบใหม่พร้อมโลโก้: ปริญญาตรี — ฿650</option>
        `;
      }
    }
  }

  // Ribbon Degree Button Clicks
  ribbonDegreeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      ribbonDegreeBtns.forEach(b => {
        b.classList.remove('bg-olive-mist', 'text-white', 'shadow-xs');
        b.classList.add('text-smoky-clay/75');
      });
      btn.classList.add('bg-olive-mist', 'text-white', 'shadow-xs');
      btn.classList.remove('text-smoky-clay/75');

      const degreeName = btn.getAttribute('data-degree');
      const activeColorSwatch = document.querySelector('.ribbon-color-swatch.scale-110');
      const activeColor = activeColorSwatch ? activeColorSwatch.getAttribute('data-color') : 'ฟ้า';

      updateRibbonCardDisplay(degreeName, activeColor);
    });
  });

  // Ribbon Color Swatch Clicks
  ribbonColorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      ribbonColorSwatches.forEach(s => {
        s.classList.remove('ring-2', 'ring-offset-2', 'ring-olive-mist', 'scale-110');
        s.classList.add('opacity-85');
      });
      swatch.classList.add('ring-2', 'ring-offset-2', 'ring-olive-mist', 'scale-110');
      swatch.classList.remove('opacity-85');

      const colorName = swatch.getAttribute('data-color');
      if (ribbonOnlyColorLabel) {
        ribbonOnlyColorLabel.textContent = `สี${colorName}`;
      }

      const activeDegreeBtn = document.querySelector('#ribbon-only-degree-group .ribbon-degree-btn.bg-olive-mist');
      const activeDegree = activeDegreeBtn ? activeDegreeBtn.getAttribute('data-degree') : 'ปริญญาตรี';

      updateRibbonCardDisplay(activeDegree, colorName);
    });
  });

  // Ribbon Close-up Gallery Thumbnail Clicks
  ribbonGalleryThumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      ribbonGalleryThumbs.forEach(t => {
        t.classList.remove('border-olive-mist', 'ring-2', 'ring-olive-mist');
        t.classList.add('border-mushroom-taupe/30', 'opacity-85');
      });
      thumb.classList.add('border-olive-mist', 'ring-2', 'ring-olive-mist');
      thumb.classList.remove('border-mushroom-taupe/30', 'opacity-85');

      const thumbImg = thumb.getAttribute('data-img');
      const thumbDegree = thumb.getAttribute('data-degree');
      const thumbColor = thumb.getAttribute('data-color');

      // Sync degree button
      ribbonDegreeBtns.forEach(btn => {
        if (btn.getAttribute('data-degree') === thumbDegree) {
          btn.classList.add('bg-olive-mist', 'text-white', 'shadow-xs');
          btn.classList.remove('text-smoky-clay/75');
        } else {
          btn.classList.remove('bg-olive-mist', 'text-white', 'shadow-xs');
          btn.classList.add('text-smoky-clay/75');
        }
      });

      // Sync color swatch
      ribbonColorSwatches.forEach(swatch => {
        if (swatch.getAttribute('data-color') === thumbColor) {
          swatch.classList.add('ring-2', 'ring-offset-2', 'ring-olive-mist', 'scale-110');
          swatch.classList.remove('opacity-85');
        } else {
          swatch.classList.remove('ring-2', 'ring-offset-2', 'ring-olive-mist', 'scale-110');
          swatch.classList.add('opacity-85');
        }
      });
      if (ribbonOnlyColorLabel) {
        ribbonOnlyColorLabel.textContent = `สี${thumbColor}`;
      }

      updateRibbonCardDisplay(thumbDegree, thumbColor, thumbImg);
    });
  });

  // Card 1: View Mode Toggle (ภาพเต็มชุด vs พอดีกรอบ)
  const gownViewFullBtn = document.getElementById('gown-view-full-btn');
  const gownViewFitBtn = document.getElementById('gown-view-fit-btn');
  const cardGownRibbonImg = document.getElementById('card-gown-ribbon-img');

  if (gownViewFullBtn && gownViewFitBtn && cardGownRibbonImg) {
    gownViewFullBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      cardGownRibbonImg.className = 'w-full h-full object-contain p-2 transition-all duration-300 origin-center will-change-transform drop-shadow-sm';
      gownViewFullBtn.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold transition-all bg-olive-mist text-white shadow-xs cursor-pointer';
      gownViewFitBtn.className = 'px-2.5 py-1 rounded-full text-[10px] font-medium text-smoky-clay/70 hover:text-smoky-clay transition-all cursor-pointer';
    });

    gownViewFitBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      cardGownRibbonImg.className = 'w-full h-full object-cover object-[center_20%] p-0 transition-all duration-300 origin-center will-change-transform';
      gownViewFitBtn.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold transition-all bg-olive-mist text-white shadow-xs cursor-pointer';
      gownViewFullBtn.className = 'px-2.5 py-1 rounded-full text-[10px] font-medium text-smoky-clay/70 hover:text-smoky-clay transition-all cursor-pointer';
    });
  }

  // Card 2: View Mode Toggle (ภาพเต็ม + โลโก้ vs ขยายพอดี)
  const ribbonViewFullBtn = document.getElementById('ribbon-view-full-btn');
  const ribbonViewZoomBtn = document.getElementById('ribbon-view-zoom-btn');

  if (ribbonViewFullBtn && ribbonViewZoomBtn && cardRibbonOnlyImg) {
    ribbonViewFullBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      cardRibbonOnlyImg.className = 'w-full h-full object-contain p-2.5 sm:p-4 transition-all duration-300 drop-shadow-md origin-center';
      ribbonViewFullBtn.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold transition-all bg-olive-mist text-white shadow-xs cursor-pointer';
      ribbonViewZoomBtn.className = 'px-2.5 py-1 rounded-full text-[10px] font-medium text-smoky-clay/70 hover:text-smoky-clay transition-all cursor-pointer';
    });

    ribbonViewZoomBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      cardRibbonOnlyImg.className = 'w-full h-full object-cover object-[center_20%] p-0 transition-all duration-300 origin-center';
      ribbonViewZoomBtn.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold transition-all bg-olive-mist text-white shadow-xs cursor-pointer';
      ribbonViewFullBtn.className = 'px-2.5 py-1 rounded-full text-[10px] font-medium text-smoky-clay/70 hover:text-smoky-clay transition-all cursor-pointer';
    });
  }
}

/* -------------------------------------------------------------------------- */
/* 3. Bespoke Fitting & Consultation Modal                                    */
/* -------------------------------------------------------------------------- */
function initBookingModal() {
  const bookingModal = document.getElementById('booking-modal');
  const openModalBtns = document.querySelectorAll('.open-booking-modal');
  const closeModalBtns = document.querySelectorAll('.close-booking-modal');
  const modalStep1Header = document.getElementById('modal-step1-header');
  const bookingForm = document.getElementById('booking-form');
  const orderSummaryStep = document.getElementById('order-summary-step');
  const bookingSuccess = document.getElementById('booking-success');

  // Step 1 Form Inputs
  const nameInput = document.getElementById('modal-name');
  const phoneInput = document.getElementById('modal-phone');
  const emailInput = document.getElementById('modal-email');
  const lineInput = document.getElementById('modal-line');
  const heightInput = document.getElementById('modal-height');
  const weightInput = document.getElementById('modal-weight');
  const garmentSelect = document.getElementById('modal-garment-select');
  const serviceSelect = document.getElementById('modal-service-select');
  const serviceWrapper = document.getElementById('modal-service-wrapper');
  const lengthSelect = document.getElementById('modal-length-select');
  const lengthWrapper = document.getElementById('modal-length-wrapper');
  const degreeSelect = document.getElementById('modal-degree-select');
  const degreeWrapper = document.getElementById('modal-degree-wrapper');
  const colorSelect = document.getElementById('modal-color-select');
  const colorWrapper = document.getElementById('modal-color-wrapper');
  const degreeColorRow = document.getElementById('modal-degree-color-row');
  const gradDateInput = document.getElementById('modal-grad-date');
  const notesTextarea = document.getElementById('modal-notes');
  const modalSizeGuideBtn = document.getElementById('modal-size-guide-btn');

  // Step 2 Summary Elements
  const summaryOrderRef = document.getElementById('summary-order-ref');
  const summaryName = document.getElementById('summary-name');
  const summaryPhone = document.getElementById('summary-phone');
  const summaryEmail = document.getElementById('summary-email');
  const summaryLine = document.getElementById('summary-line');
  const summaryHeight = document.getElementById('summary-height');
  const summaryWeight = document.getElementById('summary-weight');
  const summaryGarment = document.getElementById('summary-garment');
  const summaryService = document.getElementById('summary-service');
  const summaryDegreeRow = document.getElementById('summary-degree-row');
  const summaryDegreeColor = document.getElementById('summary-degree-color');
  const summaryLengthRow = document.getElementById('summary-length-row');
  const summaryLength = document.getElementById('summary-length');
  const summaryDateRow = document.getElementById('summary-date-row');
  const summaryDate = document.getElementById('summary-date');
  const summaryNotesRow = document.getElementById('summary-notes-row');
  const summaryNotes = document.getElementById('summary-notes');
  const summaryTotalPrice = document.getElementById('summary-total-price');
  const summaryDepositNote = document.getElementById('summary-deposit-note');

  // Step 2 Itemized Price Breakdown Elements
  const summaryRentFeeRow = document.getElementById('summary-rentfee-row');
  const summaryRentFeeLabel = document.getElementById('summary-rentfee-label');
  const summaryRentFee = document.getElementById('summary-rent-fee');
  const summaryDepositRow = document.getElementById('summary-deposit-row');
  const summaryDepositFee = document.getElementById('summary-deposit-fee');
  const summaryDegreeSurchargeRow = document.getElementById('summary-degree-surcharge-row');
  const summaryDegreeSurchargeLabel = document.getElementById('summary-degree-surcharge-label');
  const summaryDegreeSurcharge = document.getElementById('summary-degree-surcharge');
  const summaryDiscountRow = document.getElementById('summary-discount-row');
  const summaryDiscountLabel = document.getElementById('summary-discount-label');
  const summaryDiscountAmount = document.getElementById('summary-discount-amount');

  // Step 2 QR & Countdown Elements
  const summaryQrImg = document.getElementById('summary-qr-img');
  const summaryQrAmount = document.getElementById('summary-qr-amount');
  const summaryQrRef = document.getElementById('summary-qr-ref');
  const countdownTimerDisplay = document.getElementById('countdown-timer-display');

  // Step 2 Slip Upload Elements
  const slipFileInput = document.getElementById('slip-file-input');
  const slipDropZone = document.getElementById('slip-drop-zone');
  const slipUploadPrompt = document.getElementById('slip-upload-prompt');
  const slipPreviewContainer = document.getElementById('slip-preview-container');
  const slipPreviewImg = document.getElementById('slip-preview-img');
  const slipRemoveBtn = document.getElementById('slip-remove-btn');
  const slipFileName = document.getElementById('slip-file-name');
  const slipErrorMsg = document.getElementById('slip-error-msg');
  const submitPaymentBtn = document.getElementById('submit-payment-btn');
  const submitPaymentBtnText = document.getElementById('submit-payment-btn-text');
  const backToFormBtn = document.getElementById('back-to-form-btn');
  const successOrderRef = document.getElementById('success-order-ref');
  const successCustomerEmail = document.getElementById('success-customer-email');
  const successEmailDisplay = document.getElementById('success-email-display');

  let countdownInterval = null;
  let currentOrderData = {};

  // Google Apps Script Web App URL (บันทึกลง Google Sheets และ Google Drive อัตโนมัติ)
  // นำ URL ที่ได้จากการ Deploy ใน Apps Script มาวางตรงนี้ เช่น: 'https://script.google.com/macros/s/.../exec'
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyRwPMtZ2Ctp0TxeiBc0xSGvdhc1yxnj68pTZjqceu4L7W4EP76AUXb4-mOH8K95k1-/exec';

  if (!bookingModal) return;

  function updateModalFieldsVisibility() {
    const selectedGarment = garmentSelect ? garmentSelect.value : 'gown-with-ribbon';
    const selectedDegree = degreeSelect ? degreeSelect.value : 'ปริญญาตรี';
    const degreeExtra = selectedDegree === 'ปริญญาโท' ? 100 : (selectedDegree === 'ปริญญาเอก' ? 150 : 0);
    const ribbonNote = document.getElementById('modal-ribbon-note');

    if (selectedGarment === 'ribbon-only') {
      if (ribbonNote) ribbonNote.classList.remove('hidden');
    } else {
      if (ribbonNote) ribbonNote.classList.add('hidden');
    }

    if (selectedGarment === 'gown-only') {
      if (serviceWrapper) serviceWrapper.classList.remove('hidden');
      if (lengthWrapper) lengthWrapper.classList.remove('hidden');
      if (degreeColorRow) degreeColorRow.classList.add('hidden');
      if (serviceSelect) {
        serviceSelect.innerHTML = `
          <option value="เช่า" selected>เช่าชุดครุย — รวม ฿1,800 (ค่าเช่า ฿800 + มัดจำ ฿1,000 ได้คืนเมื่อนำชุดมาคืน)</option>
          <option value="เช่าตัดใหม่">เช่าตัดใหม่ — รวม ฿1,800 (ค่าเช่า ฿1,000 + มัดจำ ฿800 ได้คืนเมื่อนำชุดมาคืน)</option>
          <option value="ตัดใหม่">ตัดชุดครุยใหม่ (เป็นเจ้าของ) — ฿1,800</option>
        `;
      }
    } else if (selectedGarment === 'gown-with-ribbon') {
      if (serviceWrapper) serviceWrapper.classList.remove('hidden');
      if (lengthWrapper) lengthWrapper.classList.remove('hidden');
      if (degreeColorRow) degreeColorRow.classList.remove('hidden');
      if (degreeWrapper) degreeWrapper.classList.remove('hidden');
      if (colorWrapper) colorWrapper.classList.remove('hidden');

      const rentTotal = 2000 + degreeExtra;
      const rentFee = 1000 + degreeExtra;
      const rentNewTotal = 2300 + degreeExtra;
      const rentNewFee = 1300 + degreeExtra;
      const buyTotal = 2300 + degreeExtra;

      if (serviceSelect) {
        serviceSelect.innerHTML = `
          <option value="เช่า" selected>เช่าครบชุด — รวม ฿${rentTotal.toLocaleString()} (ค่าเช่า ฿${rentFee.toLocaleString()} + มัดจำ ฿1,000 ได้คืนเมื่อนำชุดมาคืน)</option>
          <option value="เช่าตัดใหม่">เช่าตัดใหม่ — รวม ฿${rentNewTotal.toLocaleString()} (ค่าเช่า ฿${rentNewFee.toLocaleString()} + มัดจำ ฿1,000 ได้คืนเมื่อนำชุดมาคืน)</option>
          <option value="ตัดใหม่">ตัดใหม่ครบชุด (เป็นเจ้าของ) — ฿${buyTotal.toLocaleString()}</option>
        `;
      }
    } else if (selectedGarment === 'suit') {
      if (serviceWrapper) serviceWrapper.classList.remove('hidden');
      if (lengthWrapper) lengthWrapper.classList.add('hidden');
      if (degreeColorRow) degreeColorRow.classList.add('hidden');
      if (serviceSelect) {
        serviceSelect.innerHTML = `
          <option value="เช่า" selected>บริการเช่าสูทมาตรฐาน (พร้อมปรับแก้ทรงฟรี) — ฿1,500</option>
          <option value="สั่งตัด">สั่งตัดสูทพิเศษเฉพาะบุคคล (Bespoke 28 จุด) — ฿8,900</option>
        `;
      }
    } else if (selectedGarment === 'ribbon-only') {
      if (serviceWrapper) serviceWrapper.classList.remove('hidden');
      if (lengthWrapper) lengthWrapper.classList.add('hidden');
      if (degreeColorRow) degreeColorRow.classList.remove('hidden');
      if (degreeWrapper) degreeWrapper.classList.remove('hidden');
      if (colorWrapper) colorWrapper.classList.remove('hidden');

      const rentTotal = 500 + degreeExtra;
      const rentFee = 200 + degreeExtra;
      const rentNewTotal = 600 + degreeExtra;
      const rentNewFee = 250 + degreeExtra;
      const buyTotal = selectedDegree === 'ปริญญาโท' ? 750 : (selectedDegree === 'ปริญญาเอก' ? 800 : 650);

      if (serviceSelect) {
        serviceSelect.innerHTML = `
          <option value="เช่า" selected>เช่าแถบสีพร้อมโลโก้ — รวม ฿${rentTotal.toLocaleString()} (ค่าเช่า ฿${rentFee.toLocaleString()} + มัดจำ ฿300 ได้คืนเมื่อนำแถบมาคืน)</option>
          <option value="เช่าตัดใหม่">เช่าตัดใหม่แถบสีพร้อมโลโก้ — รวม ฿${rentNewTotal.toLocaleString()} (ค่าเช่า ฿${rentNewFee.toLocaleString()} + มัดจำ ฿350 ได้คืนเมื่อนำแถบมาคืน)</option>
          <option value="ตัดใหม่">ตัดแถบใหม่พร้อมโลโก้ (${selectedDegree}) — ฿${buyTotal.toLocaleString()}</option>
        `;
      }
    }
  }

  if (garmentSelect) {
    garmentSelect.addEventListener('change', updateModalFieldsVisibility);
  }
  if (degreeSelect) {
    degreeSelect.addEventListener('change', updateModalFieldsVisibility);
  }

  // Calculate Price Breakdown
  function calculateOrderPrice() {
    const garment = garmentSelect ? garmentSelect.value : 'gown-with-ribbon';
    const service = serviceSelect ? serviceSelect.value : 'เช่า';
    const degree = degreeSelect ? degreeSelect.value : 'ปริญญาตรี';

    let rentFee = 0;
    let depositFee = 0;
    let degreeSurcharge = 0;
    let discountFee = 0;
    let discountLabel = '';
    let total = 0;
    let depositNote = '';

    // Check SPU Promotion Tier & Welcome Code (เฉพาะบริการเช่าที่มีชุดครุย)
    const promoWrapper = document.getElementById('modal-promo-wrapper');
    const promoTierSelect = document.getElementById('modal-promo-tier');
    const selectedPromoTier = promoTierSelect ? promoTierSelect.value : 'solo';
    const isRentalGown = (garment === 'gown-with-ribbon' || garment === 'gown-only') && service.includes('เช่า');

    if (promoWrapper) {
      if (isRentalGown) {
        promoWrapper.classList.remove('hidden');
      } else {
        promoWrapper.classList.add('hidden');
      }
    }

    if (isRentalGown) {
      if (selectedPromoTier === 'solo') {
        discountFee = 50;
        discountLabel = 'Welcome Code ม.ศรีปทุม (SPU50)';
      } else if (selectedPromoTier === 'duo') {
        discountFee = 100;
        discountLabel = 'โปรโมชั่นมาคู่ 2 ท่าน (ลดคนละ ฿100)';
      } else if (selectedPromoTier === 'squad') {
        discountFee = 200;
        discountLabel = 'โปรโมชั่นแก๊ง 4 ท่านขึ้นไป (ลดคนละ ฿200)';
      } else {
        discountFee = 0;
        discountLabel = '';
      }
    } else {
      discountFee = 0;
      discountLabel = '';
    }

    if (garment === 'gown-only') {
      degreeSurcharge = 0;
      if (service.includes('เช่าตัดใหม่')) {
        rentFee = 1000;
        depositFee = 800;
        total = Math.max(0, rentFee + depositFee - discountFee);
        depositNote = '* รวมค่ามัดจำ 800 บาท (จะได้รับเงินมัดจำคืน 800 บาท เมื่อนำชุดมาคืน)';
      } else if (service.includes('เช่า')) {
        rentFee = 800;
        depositFee = 1000;
        total = Math.max(0, rentFee + depositFee - discountFee);
        depositNote = '* รวมค่ามัดจำ 1,000 บาท (จะได้รับเงินมัดจำคืน 1,000 บาท เมื่อนำชุดมาคืน)';
      } else {
        rentFee = 1800;
        depositFee = 0;
        total = 1800;
        depositNote = '* สั่งตัดใหม่เป็นกรรมสิทธิ์ของลูกค้า (ไม่มีค่ามัดจำ)';
      }
    } else if (garment === 'gown-with-ribbon') {
      if (degree === 'ปริญญาโท') degreeSurcharge = 100;
      else if (degree === 'ปริญญาเอก') degreeSurcharge = 150;
      else degreeSurcharge = 0;

      if (service.includes('เช่าตัดใหม่')) {
        rentFee = 1300 + degreeSurcharge;
        depositFee = 1000;
        total = Math.max(0, rentFee + depositFee - discountFee);
        depositNote = '* รวมค่ามัดจำ 1,000 บาท (จะได้รับเงินมัดจำคืน 1,000 บาท เมื่อนำชุดและแถบมาคืน)';
      } else if (service.includes('เช่า')) {
        rentFee = 1000 + degreeSurcharge;
        depositFee = 1000;
        total = Math.max(0, rentFee + depositFee - discountFee);
        depositNote = '* รวมค่ามัดจำ 1,000 บาท (จะได้รับเงินมัดจำคืน 1,000 บาท เมื่อนำชุดและแถบมาคืน)';
      } else {
        rentFee = 2300 + degreeSurcharge;
        depositFee = 0;
        total = rentFee;
        depositNote = '* สั่งตัดใหม่ครบชุดเป็นกรรมสิทธิ์ของลูกค้า (ไม่มีค่ามัดจำ)';
      }
    } else if (garment === 'suit') {
      degreeSurcharge = 0;
      if (service.includes('เช่า')) {
        rentFee = 1500;
        depositFee = 0;
        total = 1500;
        depositNote = '* บริการเช่าสูทมาตรฐานพร้อมปรับแก้ทรงฟรี';
      } else {
        rentFee = 8900;
        depositFee = 0;
        total = 8900;
        depositNote = '* สูทสั่งตัด Bespoke วัดตัว 28 จุด เป็นกรรมสิทธิ์ของลูกค้า';
      }
    } else if (garment === 'ribbon-only') {
      if (degree === 'ปริญญาโท' || service.includes('โท')) degreeSurcharge = 100;
      else if (degree === 'ปริญญาเอก' || service.includes('เอก')) degreeSurcharge = 150;
      else degreeSurcharge = 0;

      if (service.includes('เช่าตัดใหม่')) {
        rentFee = 250 + degreeSurcharge;
        depositFee = 350;
        total = rentFee + depositFee;
        depositNote = '* รวมค่ามัดจำ 350 บาท (จะได้รับเงินมัดจำคืน 350 บาท เมื่อนำแถบมาคืน • รวมโลโก้สถาบัน ไม่มีตัวชุด)';
      } else if (service.includes('เช่า')) {
        rentFee = 200 + degreeSurcharge;
        depositFee = 300;
        total = rentFee + depositFee;
        depositNote = '* รวมค่ามัดจำ 300 บาท (จะได้รับเงินมัดจำคืน 300 บาท เมื่อนำแถบมาคืน • รวมโลโก้สถาบัน ไม่มีตัวชุด)';
      } else {
        rentFee = 650 + degreeSurcharge;
        depositFee = 0;
        total = rentFee;
        depositNote = '* สั่งตัดแถบสีใหม่พร้อมโลโก้สถาบันเป็นกรรมสิทธิ์ของลูกค้า (ไม่มีตัวชุดครุย • ไม่มีค่ามัดจำ)';
      }
    }

    return { rentFee, depositFee, degreeSurcharge, discountFee, discountLabel, total, depositNote };
  }

  // 60-Minute Countdown Timer Handler
  function startCountdownTimer() {
    if (countdownInterval) clearInterval(countdownInterval);

    let remainingSeconds = 60 * 60; // 60 minutes = 3600 seconds

    function renderTime() {
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      if (countdownTimerDisplay) {
        countdownTimerDisplay.textContent = formatted;
      }
    }

    renderTime();

    countdownInterval = setInterval(() => {
      remainingSeconds--;
      if (remainingSeconds <= 0) {
        clearInterval(countdownInterval);
        if (countdownTimerDisplay) {
          countdownTimerDisplay.textContent = '00:00';
        }
      } else {
        renderTime();
      }
    }, 1000);
  }

  function stopCountdownTimer() {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  }

  // Open Modal
  function openModal(preset = {}) {
    bookingModal.classList.remove('hidden');
    bookingModal.classList.add('flex');
    document.body.classList.add('overflow-hidden');

    // Reset step visibility
    if (modalStep1Header) modalStep1Header.classList.remove('hidden');
    if (bookingForm) bookingForm.classList.remove('hidden');
    if (orderSummaryStep) orderSummaryStep.classList.add('hidden');
    if (bookingSuccess) bookingSuccess.classList.add('hidden');
    stopCountdownTimer();

    if (garmentSelect && preset.garment) {
      if (preset.garment.includes('พร้อมแถบสี') || (preset.garment.includes('ชุดครุย') && preset.garment.includes('แถบสี'))) {
        garmentSelect.value = 'gown-with-ribbon';
      } else if ((preset.garment.includes('อย่างเดียว') || preset.garment.includes('เปล่า')) && !preset.garment.includes('แถบสี')) {
        garmentSelect.value = 'gown-only';
      } else if (preset.garment.includes('แถบสี')) {
        garmentSelect.value = 'ribbon-only';
      } else if (preset.garment.includes('สูท')) {
        garmentSelect.value = 'suit';
      } else {
        garmentSelect.value = 'gown-with-ribbon';
      }
    }

    updateModalFieldsVisibility();

    if (serviceSelect && preset.service) {
      const match = Array.from(serviceSelect.options).find(o => o.value.includes(preset.service) || preset.service.includes(o.value));
      if (match) serviceSelect.value = match.value;
    }

    if (lengthSelect && preset.length) {
      const match = Array.from(lengthSelect.options).find(o => o.value.includes(preset.length) || preset.length.includes(o.value));
      if (match) lengthSelect.value = match.value;
    }

    if (degreeSelect && preset.degree) {
      degreeSelect.value = preset.degree;
    }

    if (colorSelect && preset.color) {
      const targetColor = preset.color === 'เลือดหมู' ? 'แดงเลือดหมู' : preset.color;
      colorSelect.value = targetColor;
    }

    if (notesTextarea && preset.notes) {
      notesTextarea.value = preset.notes + (notesTextarea.value ? '\n' + notesTextarea.value : '');
    }
  }

  // Close Modal
  function closeModal() {
    bookingModal.classList.add('hidden');
    bookingModal.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
    stopCountdownTimer();

    if (bookingSuccess) bookingSuccess.classList.add('hidden');
    if (orderSummaryStep) orderSummaryStep.classList.add('hidden');
    if (modalStep1Header) modalStep1Header.classList.remove('hidden');
    if (bookingForm) {
      bookingForm.classList.remove('hidden');
      bookingForm.reset();
    }

    // Reset slip
    if (slipFileInput) slipFileInput.value = '';
    if (slipPreviewImg) slipPreviewImg.src = '';
    if (slipPreviewContainer) slipPreviewContainer.classList.add('hidden');
    if (slipUploadPrompt) slipUploadPrompt.classList.remove('hidden');
    if (slipErrorMsg) slipErrorMsg.classList.add('hidden');
    if (submitPaymentBtn) {
      submitPaymentBtn.disabled = false;
      if (submitPaymentBtnText) submitPaymentBtnText.textContent = 'ยืนยันการชำระเงิน & ส่งหลักฐาน';
    }
  }

  // Step 1: Form Submit -> Transition to Step 2 Summary & Payment
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const lineVal = lineInput ? lineInput.value.trim() : '-';
      const heightVal = heightInput ? heightInput.value.trim() : '';
      const weightVal = weightInput ? weightInput.value.trim() : '';
      const garmentVal = garmentSelect ? garmentSelect.value : 'gown-with-ribbon';
      const serviceVal = serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex].text : '';
      const degreeVal = (degreeSelect && degreeWrapper && !degreeWrapper.classList.contains('hidden')) ? degreeSelect.value : '';
      const colorVal = (colorSelect && colorWrapper && !colorWrapper.classList.contains('hidden')) ? colorSelect.value : '';
      const lengthVal = (lengthSelect && lengthWrapper && !lengthWrapper.classList.contains('hidden')) ? lengthSelect.value : '';
      const gradDateVal = gradDateInput ? gradDateInput.value : '';
      const notesVal = notesTextarea ? notesTextarea.value.trim() : '';

      const garmentNames = {
        'gown-with-ribbon': '1. ชุดครุย พร้อมแถบสีวิทยฐานะ',
        'ribbon-only': '2. แถบสีวิทยฐานะ พร้อมโลโก้สถาบัน (ไม่มีตัวชุดครุย)',
        'gown-only': '3. ชุดครุยวิทยฐานะ (อย่างเดียว)',
        'suit': '4. ชุดสูททรงสากลพิธีการ'
      };

      const garmentText = garmentNames[garmentVal] || garmentVal;

      // Generate Order Reference
      const randomRef = Math.floor(100000 + Math.random() * 900000);
      const orderRef = `#MG-${randomRef}`;

      // Calculate Prices
      const { rentFee, depositFee, degreeSurcharge, discountFee, discountLabel, total, depositNote } = calculateOrderPrice();

      // Store in currentOrderData
      currentOrderData = {
        orderRef,
        nameVal,
        phoneVal,
        emailVal,
        lineVal,
        heightVal,
        weightVal,
        garmentVal,
        garmentText,
        serviceVal,
        degreeVal,
        colorVal,
        lengthVal,
        gradDateVal,
        notesVal,
        rentFee,
        depositFee,
        degreeSurcharge,
        discountFee,
        discountLabel,
        total,
        depositNote
      };

      // Populate Step 2 Elements
      if (summaryOrderRef) summaryOrderRef.textContent = orderRef;
      if (summaryName) summaryName.textContent = nameVal;
      if (summaryPhone) summaryPhone.textContent = phoneVal;
      if (summaryEmail) summaryEmail.textContent = emailVal;
      if (summaryLine) summaryLine.textContent = lineVal;
      if (summaryHeight) summaryHeight.textContent = `${heightVal} ซม.`;
      if (summaryWeight) summaryWeight.textContent = `${weightVal} กก.`;
      if (summaryGarment) summaryGarment.textContent = garmentText;
      if (summaryService) summaryService.textContent = serviceVal.split('—')[0].trim();

      if (summaryDegreeRow) {
        if (degreeVal || colorVal) {
          summaryDegreeRow.classList.remove('hidden');
          if (summaryDegreeColor) summaryDegreeColor.textContent = [degreeVal, colorVal ? `สี${colorVal}` : ''].filter(Boolean).join(' • ');
        } else {
          summaryDegreeRow.classList.add('hidden');
        }
      }

      if (summaryLengthRow) {
        if (lengthVal) {
          summaryLengthRow.classList.remove('hidden');
          if (summaryLength) summaryLength.textContent = lengthVal;
        } else {
          summaryLengthRow.classList.add('hidden');
        }
      }

      if (summaryDateRow) {
        if (gradDateVal) {
          summaryDateRow.classList.remove('hidden');
          if (summaryDate) summaryDate.textContent = gradDateVal;
        } else {
          summaryDateRow.classList.add('hidden');
        }
      }

      if (summaryNotesRow) {
        if (notesVal) {
          summaryNotesRow.classList.remove('hidden');
          if (summaryNotes) summaryNotes.textContent = notesVal;
        } else {
          summaryNotesRow.classList.add('hidden');
        }
      }

      // Populate Itemized Price Breakdown
      if (summaryRentFee) summaryRentFee.textContent = `฿${rentFee.toLocaleString()}`;
      if (summaryRentFeeLabel) {
        summaryRentFeeLabel.textContent = (serviceVal.includes('ตัดใหม่') && !serviceVal.includes('เช่าตัด'))
          ? 'ค่าตัดเย็บ (เป็นเจ้าของชุด):' 
          : 'ค่าบริการเช่า:';
      }
      if (summaryDepositFee) {
        summaryDepositFee.textContent = depositFee > 0 ? `฿${depositFee.toLocaleString()}` : '฿0 (ไม่มีมัดจำ)';
      }
      if (summaryDepositRow) {
        if (depositFee === 0) {
          summaryDepositRow.classList.add('opacity-50');
        } else {
          summaryDepositRow.classList.remove('opacity-50');
        }
      }

      if (summaryDegreeSurchargeRow) {
        if (degreeSurcharge > 0) {
          summaryDegreeSurchargeRow.classList.remove('hidden');
          if (summaryDegreeSurcharge) summaryDegreeSurcharge.textContent = `+฿${degreeSurcharge.toLocaleString()} (ระดับ ${degreeVal})`;
        } else {
          summaryDegreeSurchargeRow.classList.add('hidden');
        }
      }

      if (summaryDiscountRow) {
        if (discountFee > 0) {
          summaryDiscountRow.classList.remove('hidden');
          if (summaryDiscountLabel) summaryDiscountLabel.textContent = `${discountLabel}:`;
          if (summaryDiscountAmount) summaryDiscountAmount.textContent = `-฿${discountFee.toLocaleString()}`;
        } else {
          summaryDiscountRow.classList.add('hidden');
        }
      }

      if (summaryTotalPrice) summaryTotalPrice.textContent = `฿${total.toLocaleString()}`;
      if (summaryDepositNote) summaryDepositNote.textContent = depositNote;

      // QR Code Generation for PromptPay
      if (summaryQrAmount) summaryQrAmount.textContent = `฿${total.toLocaleString()}.00`;
      if (summaryQrRef) summaryQrRef.textContent = orderRef;
      if (summaryQrImg) {
        const qrData = encodeURIComponent(`https://promptpay.io/0936165438/${total}`);
        summaryQrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrData}`;
      }

      // Transition views: hide step 1, show step 2
      if (modalStep1Header) modalStep1Header.classList.add('hidden');
      bookingForm.classList.add('hidden');
      if (orderSummaryStep) orderSummaryStep.classList.remove('hidden');

      // Scroll modal to top
      const modalScrollContainer = bookingModal.querySelector('.overflow-y-auto');
      if (modalScrollContainer) modalScrollContainer.scrollTop = 0;

      // Reinitialize Lucide icons in newly displayed step
      if (window.lucide) window.lucide.createIcons();

      // Start 60-minute countdown timer
      startCountdownTimer();
    });
  }

  // Back to Form Button
  if (backToFormBtn) {
    backToFormBtn.addEventListener('click', () => {
      stopCountdownTimer();
      if (orderSummaryStep) orderSummaryStep.classList.add('hidden');
      if (modalStep1Header) modalStep1Header.classList.remove('hidden');
      if (bookingForm) bookingForm.classList.remove('hidden');
      const modalScrollContainer = bookingModal.querySelector('.overflow-y-auto');
      if (modalScrollContainer) modalScrollContainer.scrollTop = 0;
      if (window.lucide) window.lucide.createIcons();
    });
  }

  // Size Guide Link inside Modal: closes modal and scrolls to #measurement-guide
  if (modalSizeGuideBtn) {
    modalSizeGuideBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
      const guideSection = document.getElementById('measurement-guide');
      if (guideSection) {
        guideSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Slip Upload: Drop zone click & File input handling
  if (slipDropZone && slipFileInput) {
    slipDropZone.addEventListener('click', (e) => {
      if (e.target !== slipRemoveBtn && !slipRemoveBtn?.contains(e.target)) {
        slipFileInput.click();
      }
    });

    slipFileInput.addEventListener('change', () => {
      const file = slipFileInput.files[0];
      if (file) {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (slipPreviewImg) slipPreviewImg.src = event.target.result;
            if (slipPreviewContainer) slipPreviewContainer.classList.remove('hidden');
            if (slipUploadPrompt) slipUploadPrompt.classList.add('hidden');
            if (slipFileName) {
              const span = slipFileName.querySelector('span');
              if (span) span.textContent = `แนบสลิป: ${file.name} (${Math.round(file.size / 1024)} KB)`;
            }
            if (slipErrorMsg) slipErrorMsg.classList.add('hidden');
            if (window.lucide) window.lucide.createIcons();
          };
          reader.readAsDataURL(file);
        } else {
          // Non-image (e.g. PDF)
          if (slipPreviewImg) slipPreviewImg.src = 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=200&auto=format&fit=crop&q=80';
          if (slipPreviewContainer) slipPreviewContainer.classList.remove('hidden');
          if (slipUploadPrompt) slipUploadPrompt.classList.add('hidden');
          if (slipFileName) {
            const span = slipFileName.querySelector('span');
            if (span) span.textContent = `แนบไฟล์: ${file.name} (${Math.round(file.size / 1024)} KB)`;
          }
          if (slipErrorMsg) slipErrorMsg.classList.add('hidden');
          if (window.lucide) window.lucide.createIcons();
        }
      }
    });

    // Drag & Drop
    ['dragenter', 'dragover'].forEach(eventName => {
      slipDropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        slipDropZone.classList.add('border-olive-mist', 'bg-soft-greige/70');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      slipDropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        slipDropZone.classList.remove('border-olive-mist', 'bg-soft-greige/70');
      });
    });

    slipDropZone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        slipFileInput.files = files;
        slipFileInput.dispatchEvent(new Event('change'));
      }
    });
  }

  // Remove Slip Button
  if (slipRemoveBtn) {
    slipRemoveBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (slipFileInput) slipFileInput.value = '';
      if (slipPreviewImg) slipPreviewImg.src = '';
      if (slipPreviewContainer) slipPreviewContainer.classList.add('hidden');
      if (slipUploadPrompt) slipUploadPrompt.classList.remove('hidden');
      if (window.lucide) window.lucide.createIcons();
    });
  }

  // Step 2: Confirm Payment & Submit Slip -> Send to jtpaae@gmail.com
  if (submitPaymentBtn) {
    submitPaymentBtn.addEventListener('click', async () => {
      if (!slipFileInput || slipFileInput.files.length === 0) {
        if (slipErrorMsg) slipErrorMsg.classList.remove('hidden');
        slipDropZone?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      if (slipErrorMsg) slipErrorMsg.classList.add('hidden');

      // Loading State
      submitPaymentBtn.disabled = true;
      if (submitPaymentBtnText) submitPaymentBtnText.textContent = 'กำลังส่งหลักฐานและข้อมูลคำสั่งซื้อ...';

      // Convert slip file to Base64 for Google Sheets / Google Drive
      let slipBase64 = '';
      const slipFile = slipFileInput.files[0];
      if (slipFile) {
        try {
          slipBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => resolve('');
            reader.readAsDataURL(slipFile);
          });
        } catch (e) {
          console.warn('Base64 conversion error:', e);
        }
      }

      // 1. Dispatch to Google Apps Script (Google Sheets & Google Drive) if configured
      if (GOOGLE_SCRIPT_URL) {
        try {
          const gasPayload = {
            orderRef: currentOrderData.orderRef,
            customerName: currentOrderData.nameVal,
            customerEmail: currentOrderData.emailVal,
            phone: currentOrderData.phoneVal,
            lineId: currentOrderData.lineVal,
            size: currentOrderData.lengthVal || '-',
            height: currentOrderData.heightVal,
            weight: currentOrderData.weightVal,
            garment: currentOrderData.garmentText,
            service: currentOrderData.serviceVal,
            degree: currentOrderData.degreeVal || '-',
            color: currentOrderData.colorVal || '-',
            rentFee: `฿${currentOrderData.rentFee.toLocaleString()} บาท`,
            depositFee: currentOrderData.depositFee > 0 ? `฿${currentOrderData.depositFee.toLocaleString()} บาท` : '฿0 (ไม่มีมัดจำ)',
            degreeSurcharge: currentOrderData.degreeSurcharge > 0 ? `+฿${currentOrderData.degreeSurcharge.toLocaleString()} บาท` : '-',
            discountFee: currentOrderData.discountFee > 0 ? `-฿${currentOrderData.discountFee.toLocaleString()} บาท (${currentOrderData.discountLabel})` : '-',
            totalAmount: `฿${currentOrderData.total.toLocaleString()} บาท`,
            depositNote: currentOrderData.depositNote,
            gradDate: currentOrderData.gradDateVal || '-',
            notes: currentOrderData.notesVal || '-',
            slipBase64: slipBase64,
            slipFileName: slipFile ? slipFile.name : `${currentOrderData.orderRef}_slip.jpg`
          };

          await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(gasPayload)
          });
        } catch (gasErr) {
          console.warn('Google Sheets GAS Dispatch Notice:', gasErr);
        }
      }

      // 2. Prepare FormData for FormSubmit API (destination: jtpaae@gmail.com and buyer cc)
      const formData = new FormData();
      formData.append('_subject', `[Madame Gown คำสั่งซื้อ #${currentOrderData.orderRef}] คุณ${currentOrderData.nameVal} | ไซส์: ${currentOrderData.lengthVal || '-'} | ฮูด: ${currentOrderData.degreeVal || '-'} | แถบสี: ${currentOrderData.colorVal || '-'}`);
      formData.append('_template', 'table');
      formData.append('_captcha', 'false');
      if (currentOrderData.emailVal) {
        formData.append('Customer_Email_อีเมลลูกค้า', currentOrderData.emailVal);
        formData.append('_replyto', currentOrderData.emailVal);
        formData.append('_autoresponse', `ขอบพระคุณ คุณ${currentOrderData.nameVal} ที่ไว้วางใจเลือกใช้บริการ Madame Gown (มาดามเกาวน์)

ทางร้านได้รับข้อมูลคำสั่งซื้อหมายเลข ${currentOrderData.orderRef} และหลักฐานการชำระเงินเรียบร้อยแล้ว ช่างใหญ่กำลังตรวจสอบข้อมูลสัดส่วนเพื่อเตรียมชุดให้พอดีตัวและสง่างามที่สุดในวันสำคัญครับ

=========================================
📋 สรุปรายการคำสั่งซื้อ / จองชุด
=========================================
- หมายเลขคำสั่งซื้อ: ${currentOrderData.orderRef}
- สินค้า & บริการ: ${currentOrderData.garmentText} (${currentOrderData.serviceVal})
- ไซส์ความยาวชุด: ${currentOrderData.lengthVal || '-'}
- สรีระผู้สวมใส่: ส่วนสูง ${currentOrderData.heightVal} ซม. / น้ำหนัก ${currentOrderData.weightVal} กก.
- ระดับวิทยฐานะ & แถบสี: ${currentOrderData.degreeVal || '-'} • ${currentOrderData.colorVal || '-'}
- ค่าบริการเช่า/ตัด: ฿${currentOrderData.rentFee.toLocaleString()} บาท
- เงินประกันมัดจำ: ${currentOrderData.depositFee > 0 ? `฿${currentOrderData.depositFee.toLocaleString()} บาท (คืนเมื่อส่งคืนชุด)` : 'ไม่มีมัดจำ'}
${currentOrderData.discountFee > 0 ? `- ส่วนลดคูปอง: -฿${currentOrderData.discountFee.toLocaleString()} บาท (${currentOrderData.discountLabel})\n` : ''}- ยอดชำระสุทธิ: ฿${currentOrderData.total.toLocaleString()} บาท
- กำหนดการใช้งาน: ${currentOrderData.gradDateVal || '-'}
- เบอร์โทรติดต่อ: ${currentOrderData.phoneVal} (LINE: ${currentOrderData.lineVal})

=========================================
📌 เงื่อนไขและกำหนดการส่งคืนชุดครุย & คืนเงินมัดจำ
=========================================
1. กำหนดการส่งคืน (Return Timeline):
   • เช่าวันพิธี: กำหนดส่งคืนภายใน 7 วัน หลังจากเสร็จสิ้นพิธีพระราชทานปริญญาบัตร
   • กรณีเช่าถ่ายนอกรอบ: ส่งคืนภายใน 7 วัน นับจากวันที่ลูกค้ารับชุด
   • ส่งทางพัสดุ: ยึดจาก "ตราประทับวันที่จัดส่ง" ของขนส่ง (ไปรษณีย์ไทย / Flash / Kerry) เป็นหลัก บัณฑิตส่งวันสุดท้ายได้ทันที

2. การคืนเงินประกันมัดจำ (Deposit Refund):
   • โอนคืนเข้าบัญชีภายใน 1 - 3 วันทำการ หลังพนักงานตรวจเช็กสภาพชุดเรียบร้อย (พร้อมส่งสลิปยืนยันทาง LINE)
   • คืนเงินสดทันที หากนำชุดมาส่งคืนด้วยตนเองที่หน้าร้าน Madame Gown
   • ฟรี! ไม่หักเงินประกัน สำหรับรอยเปื้อนเหงื่อไคล หรือฝุ่นละอองจากการใช้งานปกติ ร้านดูแลซักอบรีดให้โดยไม่มีค่าใช้จ่าย

3. ระเบียบการดูแลและอัตราค่าปรับ:
   • ความเสียหายเล็กน้อยซ่อมได้ (ตะเข็บปริ, กระดุมหลุด, ซิปแตก): หักเงินประกัน 50 - 150 บาท
   • อุปกรณ์เสริมสูญหาย (เข็มวิทยฐานะ, ตราสถาบัน): ชดใช้ตามราคาอะไหล่ 150 บาท
   • ส่งคืนล่าช้ากว่ากำหนด: คิดค่าปรับเริ่มต้น 50 บาท/วัน/ชุด (หากเกิน 15-30 วันโดยไม่แจ้ง ถือว่าซื้อขาดและริบมัดจำ)
   • ความเสียหายหนักซ่อมไม่ได้ (ผ้าไหม้จากเตารีด, โดนบุหรี่จี้, หมึกฝังแน่น): หักค่าเปลี่ยนชิ้นส่วนหรือหักตามจริง

📍 ที่อยู่สำหรับส่งพัสดุคืนชุด:
   ห้องเสื้อ Madame Gown (แผนกคืนชุดครุย)
   โทร. 093-616-5438, 089-694-6286 | LINE: https://line.me/ti/p/rjTwr_ZsQv
   (เมื่อจัดส่งพัสดุแล้ว สามารถถ่ายรูปสลิปเลข Tracking แจ้งแอดมินทาง LINE ได้ตลอด 24 ชม.)`);
      }
      formData.append('Order_Number_หมายเลขคำสั่งซื้อ', currentOrderData.orderRef);
      formData.append('Customer_Name_ชื่อลูกค้า', currentOrderData.nameVal);
      formData.append('Size_ไซส์ความยาวชุด', currentOrderData.lengthVal || '-');
      formData.append('Height_ส่วนสูง', `${currentOrderData.heightVal} ซม.`);
      formData.append('Weight_น้ำหนัก', `${currentOrderData.weightVal} กก.`);
      formData.append('Hood_ฮูดวิทยฐานะ', currentOrderData.degreeVal ? `ฮูดระดับ ${currentOrderData.degreeVal}` : 'ฮูดมาตรฐานวิทยฐานะ');
      formData.append('Hood_Color_แถบสีวิทยฐานะ', currentOrderData.colorVal ? `สี${currentOrderData.colorVal}` : '-');
      formData.append('Garment_ประเภทสินค้า', currentOrderData.garmentText);
      formData.append('Service_รูปแบบบริการ', currentOrderData.serviceVal);
      formData.append('Rental_Fee_ค่าเช่าหรือตัดเย็บ', `฿${currentOrderData.rentFee.toLocaleString()} บาท`);
      formData.append('Deposit_Fee_เงินประกันมัดจำ', currentOrderData.depositFee > 0 ? `฿${currentOrderData.depositFee.toLocaleString()} บาท (คืนเมื่อส่งคืนชุด)` : '฿0 (ไม่มีมัดจำ)');
      if (currentOrderData.degreeSurcharge > 0) {
        formData.append('Degree_Surcharge_ส่วนต่างระดับวิทยฐานะ', `+฿${currentOrderData.degreeSurcharge.toLocaleString()} บาท (ระดับ ${currentOrderData.degreeVal})`);
      }
      if (currentOrderData.discountFee > 0) {
        formData.append('Discount_ส่วนลดคูปอง', `-฿${currentOrderData.discountFee.toLocaleString()} บาท (${currentOrderData.discountLabel})`);
      }
      formData.append('Total_Amount_ยอดชำระทั้งสิ้น', `฿${currentOrderData.total.toLocaleString()} บาท`);
      formData.append('Deposit_Refund_Condition_เงื่อนไขการคืนมัดจำ', currentOrderData.depositNote);
      formData.append('Phone_เบอร์โทรศัพท์', currentOrderData.phoneVal);
      formData.append('LINE_ID', currentOrderData.lineVal);
      formData.append('Graduation_Date_กำหนดการใช้งาน', currentOrderData.gradDateVal || '-');
      formData.append('Notes_หมายเหตุ', currentOrderData.notesVal || '-');

      // FormSubmit uses 'attachment' keyword to send file attachments directly to recipient email
      if (slipFile) {
        formData.append('attachment', slipFile);
        formData.append('Payment_Slip_Photo', slipFile);
      }

      try {
        await fetch('https://formsubmit.co/ajax/jtpaae@gmail.com', {
          method: 'POST',
          body: formData
        });
      } catch (err) {
        console.warn('FormSubmit Dispatch Notice:', err);
      }

      // Save order to LocalStorage
      try {
        const savedOrders = JSON.parse(localStorage.getItem('madame_gown_orders') || '[]');
        savedOrders.push({
          ...currentOrderData,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('madame_gown_orders', JSON.stringify(savedOrders));
      } catch (e) {
        console.warn('LocalStorage save notice:', e);
      }

      stopCountdownTimer();

      // Show Success Screen & Populate Recap
      if (orderSummaryStep) orderSummaryStep.classList.add('hidden');
      if (successOrderRef) successOrderRef.textContent = currentOrderData.orderRef;

      const successOrderId = document.getElementById('success-order-id');
      const successCustomerName = document.getElementById('success-customer-name');
      const successHood = document.getElementById('success-hood');
      const successColor = document.getElementById('success-color');
      const successSize = document.getElementById('success-size');
      const successPrice = document.getElementById('success-price');
      const successSlipImg = document.getElementById('success-slip-img');

      if (successOrderId) successOrderId.textContent = currentOrderData.orderRef;
      if (successCustomerName) successCustomerName.textContent = currentOrderData.nameVal;
      if (successCustomerEmail) successCustomerEmail.textContent = currentOrderData.emailVal;
      if (successEmailDisplay) successEmailDisplay.textContent = currentOrderData.emailVal;
      if (successHood) successHood.textContent = currentOrderData.degreeVal ? `ฮูดระดับ ${currentOrderData.degreeVal}` : 'ฮูดมาตรฐานวิทยฐานะ';
      if (successColor) successColor.textContent = currentOrderData.colorVal ? `สี${currentOrderData.colorVal}` : 'ตามระเบียบมหาวิทยาลัย';
      if (successSize) successSize.textContent = `${currentOrderData.lengthVal || 'ขนาดมาตรฐาน'} (สูง ${currentOrderData.heightVal} ซม. / หนัก ${currentOrderData.weightVal} กก.)`;
      if (successPrice) successPrice.textContent = `฿${currentOrderData.total.toLocaleString()}`;

      if (successSlipImg && slipPreviewImg && slipPreviewImg.src) {
        successSlipImg.src = slipPreviewImg.src;
      }

      if (bookingSuccess) bookingSuccess.classList.remove('hidden');

      const modalScrollContainer = bookingModal.querySelector('.overflow-y-auto');
      if (modalScrollContainer) modalScrollContainer.scrollTop = 0;

      if (window.lucide) window.lucide.createIcons();
    });
  }

  // Open Modal Buttons
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const garment = btn.getAttribute('data-garment') || '';
      let preset = { garment };

      if ((garment.includes('อย่างเดียว') || garment.includes('เปล่า')) && !garment.includes('แถบสี')) {
        const serviceElem = document.getElementById('gown-only-service');
        const lengthElem = document.getElementById('gown-only-length');
        if (serviceElem) preset.service = serviceElem.value;
        if (lengthElem) preset.length = lengthElem.value;
      } else if (garment.includes('พร้อมแถบสี')) {
        const activeDegreeBtn = document.querySelector('#degree-selector-group .degree-btn.bg-olive-mist');
        const activeColor = document.querySelector('.gown-color-swatch.scale-110');
        const serviceElem = document.getElementById('gown-with-ribbon-service');
        const lengthElem = document.getElementById('gown-with-ribbon-length');

        if (activeDegreeBtn) preset.degree = activeDegreeBtn.getAttribute('data-degree');
        if (activeColor) preset.color = activeColor.getAttribute('data-color');
        if (serviceElem) preset.service = serviceElem.value;
        if (lengthElem) preset.length = lengthElem.value;
      } else if (garment.includes('สูท')) {
        const serviceElem = document.getElementById('suit-service');
        if (serviceElem) preset.service = serviceElem.value;
      } else if (garment.includes('แถบสี') && !garment.includes('พร้อมแถบสี')) {
        const activeRibbonDegree = document.querySelector('#ribbon-only-degree-group .ribbon-degree-btn.bg-olive-mist');
        const activeColor = document.querySelector('.ribbon-color-swatch.scale-110');
        const serviceElem = document.getElementById('ribbon-only-service');
        if (activeRibbonDegree) preset.degree = activeRibbonDegree.getAttribute('data-degree');
        if (activeColor) preset.color = activeColor.getAttribute('data-color');
        if (serviceElem) preset.service = serviceElem.value;
      }

      openModal(preset);
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !bookingModal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Initial field configuration
  updateModalFieldsVisibility();
}

/* -------------------------------------------------------------------------- */
/* 4. Product Detail Modal Data in Thai (4 Core Categories)                   */
/* -------------------------------------------------------------------------- */
const PRODUCT_DETAILS_DATA_TH = {
  "gown-with-ribbon": {
    title: "1. ชุดครุย พร้อมแถบสีวิทยฐานะ",
    subtitle: "ครบชุดพร้อมฮูดวิทยฐานะ (Hood) ผ้าซาตินเกรดพรีเมียม สอยด้วยมืออย่างประณีต (มีครบทั้ง 11 สีประจำคณะ)",
    image: "assets/images/products/gown_bachelor degree.jpg",
    fabric: "ผ้าทวิลพรีเมียม / ผ้าวูลผสม แพรไหม และฮูดวิทยฐานะ (Hood) ผ้าซาตินเกรดพรีเมียม พร้อมขนสัตว์ขาวแท้",
    leadTime: "ตัดใหม่: 2-3 สัปดาห์ | เช่าตัดใหม่: 2 สัปดาห์ | เช่า: มีสต็อกพร้อมปรับแก้วัดตัว",
    price: "เช่า รวม ฿2,000 (มัดจำ ฿1,000) | เช่าตัดใหม่ รวม ฿2,300 (มัดจำ ฿1,000) | ตัดใหม่ครบชุด ฿2,300 (ป.โท ฿2,400 / ป.เอก ฿2,450)",
    description: "ชุดครุยครบชุดพร้อมสอยแถบวิทยฐานะประจำคณะ มีระดับการศึกษาให้เลือกทั้ง:\n• ปริญญาตรี: แถบสีมาตรฐาน ขลิบขนสีขาว 1 ชั้น\n• ปริญญาโท: แถบสีมีขนสีขาว 2 ชั้น (+100 บาท)\n• ปริญญาเอก: แถบสีมีขนสีขาว 3 ชั้น (+150 บาท)\nพร้อมแถบสีครบทั้ง 11 สีประจำคณะ (ฟ้า, เขียว, เหลือง, ส้ม, ชมพูม่วง, ม่วง, แดงเลือดหมู, ขาว, เทาฟ้า, เทาส้ม, ฟ้าการบิน) บริการเช่ารวม 2,000 บาท (ค่าเช่า 1,000 + มัดจำ 1,000 ได้คืนเมื่อนำชุดมาคืน), เช่าตัดใหม่รวม 2,300 บาท (ค่าเช่า 1,300 + มัดจำ 1,000 ได้คืนเมื่อนำชุดมาคืน), หรือตัดใหม่ครบชุด เริ่มต้น ป.ตรี 2,300 บาท, ป.โท 2,400 บาท (+100 บาท), ป.เอก 2,450 บาท (+150 บาท)"
  },
  "ribbon-only": {
    title: "2. แถบสีวิทยฐานะ พร้อมโลโก้สถาบัน (ไม่มีตัวชุดครุย)",
    subtitle: "มีครบทั้ง 11 สีประจำคณะ พร้อมตราสัญลักษณ์/โลโก้ของสถาบันครบชุด (ไม่มีตัวชุดครุย)",
    image: "assets/images/products/gown_blue_closeup.jpg",
    fabric: "ฮูดวิทยฐานะ (Hood) ผ้าซาตินเกรดพรีเมียม เนื้อเนียนละเอียด ประกายเงาสวย ทิ้งตัวสง่างาม สีสดไม่ซีดจาง ขลิบขนสัตว์ขาวแท้",
    leadTime: "สั่งทำใหม่เฉพาะบุคคล: 7-10 วัน | เช่า: มีแถบสีพร้อมจัดส่ง/รับทันที",
    price: "เช่า รวม ฿500 (มัดจำ ฿300) | เช่าตัดใหม่ รวม ฿600 (มัดจำ ฿350) | ตัดใหม่ ตรี ฿650 | โท ฿750 | เอก ฿800",
    description: "ข้อชี้แจงสำคัญ: การสั่งซื้อแถบสี จะไม่มีตัวชุดครุยมาให้ แต่มีโลโก้ของสถาบันมาให้ครบชุด ฮูดวิทยฐานะ (Hood) ตัดเย็บด้วยผ้าซาตินเกรดพรีเมียม เนื้อเนียนประกายเงาสวย สีสดไม่ซีดจาง พับเก็บขอบด้วยมืออย่างประณีต มีระเบียบวิทยฐานะดังนี้:\n• ปริญญาตรี: แถบสีมาตรฐาน ขลิบขนสีขาว 1 ชั้น\n• ปริญญาโท: แถบสีมีขนสีขาว 2 ชั้น (+100 บาท)\n• ปริญญาเอก: แถบสีมีขนสีขาว 3 ชั้น (+150 บาท)\nมีให้เลือกครบทั้ง 11 สี (ฟ้า, เขียว, เหลือง, ส้ม, ชมพูม่วง, ม่วง, แดงเลือดหมู, ขาว, เทาฟ้า, เทาส้ม, ฟ้าการบิน) ราคาเช่า รวม 500 บาท (ค่าเช่า 200 + มัดจำ 300 ได้คืนเมื่อนำแถบมาคืน) หรือเช่าตัดใหม่ รวม 600 บาท (ค่าเช่า 250 + มัดจำ 350 ได้คืนเมื่อนำแถบมาคืน) หรือสั่งตัดแถบใหม่พร้อมโลโก้ ปริญญาตรี 650 บาท, ปริญญาโท 750 บาท (+100 บาท), ปริญญาเอก 800 บาท (+150 บาท)"
  },
  "gown-only": {
    title: "3. ชุดครุยวิทยฐานะ (อย่างเดียว)",
    subtitle: "ทรงชุดมาตรฐาน พร้อมภาพเจาะลึก 5 จุดตัดเย็บ (คอเสื้อ, จีบไหล่, ซิปหน้า-หลัง)",
    image: "assets/images/products/gown_standard.jpg",
    detailsImage: "assets/images/products/gown standard details.jpg",
    fabric: "ผ้าทวิลพรีเมียม / แพรไหมอิตาลี น้ำหนักเบา ทิ้งตัวสง่างาม สวมสบาย ไม่รั้งคอ",
    leadTime: "ตัดใหม่: 1-2 สัปดาห์ | เช่าตัดใหม่: 1-2 สัปดาห์ | เช่า: มีไซส์พร้อมรับทันที",
    price: "เช่า รวม ฿1,800 (มัดจำ ฿1,000) | เช่าตัดใหม่ รวม ฿1,800 (มัดจำ ฿800) | ตัดใหม่ ฿1,800",
    description: "ตัวชุดครุยตัดเย็บตามแพทเทิร์นเฉพาะตัว สวมใส่สบาย ไม่หนัก ไม่รั้งคอ ระบายอากาศยอดเยี่ยม ในหน้านี้มีให้ชม 2 รูปแบบ: 1. รูปทรงชุดมาตรฐานเต็มตัวบนหุ่น (เลื่อนเมาส์เพื่อดูจากคอเสื้อจรดชายครุย) และ 2. ภาพเจาะลึก 5 จุดช่างตัดเย็บ (จีบไหล่, คอเสื้อ, ซิปหน้า และซิปหลังซ่อนกระดุม) อัตราค่าบริการ: เช่าชุด รวม 1,800 บาท (ค่าเช่า 800 + มัดจำ 1,000 บาท ได้คืนเมื่อนำชุดมาคืน), เช่าตัดใหม่มือหนึ่ง รวม 1,800 บาท (ค่าเช่า 1,000 + มัดจำ 800 บาท ได้คืนเมื่อนำชุดมาคืน), ตัดชุดใหม่เป็นเจ้าของ 1,800 บาท"
  },
  "ceremonial-suit": {
    title: "4. ชุดสูททรงสากลพิธีการ (Bespoke Suit)",
    subtitle: "สูทสากลสีสุภาพตามระเบียบสำหรับบัณฑิต คณาจารย์ และผู้ทรงคุณวุฒิ",
    image: "assets/images/products/suit.jpg",
    fabric: "ผ้าวูลแท้ Super 130s-150s คัดเกรดพรีเมียม ซับในระบายอากาศ",
    leadTime: "สูทสั่งตัดแบบ Bespoke วัดตัวละเอียด 28 จุด (3-4 สัปดาห์) | เช่า: พร้อมรับทันที",
    price: "บริการเช่า เริ่มต้น ฿1,500 | สั่งตัดพิเศษ เริ่มต้น ฿8,900",
    description: "สูทสากลคัตติ้งเนี้ยบ ออกแบบโดยคุณแม่ช่างใหญ่ให้สวมใส่ทับใต้ชุดครุยได้อย่างแนบเนียน ไม่หนาเทอะทะ เสริมบุคลิกภาพให้ดูสง่างาม ภูมิฐาน ทั้งในพิธีการและงานเลี้ยงฉลอง"
  }
};

function initProductDetailModal() {
  const detailModal = document.getElementById('product-detail-modal');
  const viewDetailBtns = document.querySelectorAll('.open-detail-modal');
  const closeDetailBtns = document.querySelectorAll('.close-detail-modal');

  if (!detailModal) return;

  const modalImg = document.getElementById('detail-modal-img');
  const modalTitle = document.getElementById('detail-modal-title');
  const modalSubtitle = document.getElementById('detail-modal-subtitle');
  const modalPrice = document.getElementById('detail-modal-price');
  const modalFabric = document.getElementById('detail-modal-fabric');
  const modalLeadTime = document.getElementById('detail-modal-leadtime');
  const modalDesc = document.getElementById('detail-modal-desc');
  const modalOrderBtn = document.getElementById('detail-modal-order-btn');
  const modalMeasurementWrapper = document.getElementById('detail-modal-measurement-wrapper');
  const modalSizeGuideBtn = document.getElementById('detail-modal-size-guide-btn');

  function openDetailModal(productId) {
    const data = PRODUCT_DETAILS_DATA_TH[productId];
    if (!data) return;

    let displayImg = data.image;
    if (productId === 'gown-with-ribbon') {
      const currentGownImg = document.getElementById('card-gown-ribbon-img');
      if (currentGownImg && currentGownImg.src) displayImg = currentGownImg.src;
    } else if (productId === 'ribbon-only') {
      const currentRibbonImg = document.getElementById('card-ribbon-only-img');
      if (currentRibbonImg && currentRibbonImg.src) displayImg = currentRibbonImg.src;
    } else if (productId === 'gown-only') {
      const currentGownOnlyImg = document.getElementById('card-gown-only-img');
      if (currentGownOnlyImg && currentGownOnlyImg.src) displayImg = currentGownOnlyImg.src;
    }

    // Modal Dual Photo Switcher for Gown Only (Thumbs + Floating Arrows)
    const modalThumbs = document.getElementById('detail-modal-thumbs');
    const modalThumbStandard = document.getElementById('modal-thumb-standard');
    const modalThumbDetails = document.getElementById('modal-thumb-details');
    const modalArrowPrev = document.getElementById('modal-arrow-prev');
    const modalArrowNext = document.getElementById('modal-arrow-next');

    const GOWN_MODAL_PHOTOS = {
      standard: 'assets/images/products/gown standard.jpg',
      details: 'assets/images/products/gown standard details.jpg'
    };
    let modalCurrentView = 'standard';

    function setModalPhoto(view) {
      modalCurrentView = view;
      if (modalImg) {
        modalImg.style.opacity = '0.35';
        setTimeout(() => {
          modalImg.src = GOWN_MODAL_PHOTOS[view];
          modalImg.style.opacity = '1';
        }, 120);
      }
      if (modalThumbStandard && modalThumbDetails) {
        if (view === 'standard') {
          modalThumbStandard.className = 'px-3 py-1.5 rounded-xl border border-olive-mist bg-olive-mist/10 text-xs font-semibold text-olive-mist flex items-center gap-1.5 cursor-pointer';
          modalThumbDetails.className = 'px-3 py-1.5 rounded-xl border border-mushroom-taupe/30 hover:border-olive-mist bg-warm-ivory text-xs font-medium text-smoky-clay flex items-center gap-1.5 cursor-pointer';
        } else {
          modalThumbDetails.className = 'px-3 py-1.5 rounded-xl border border-olive-mist bg-olive-mist/10 text-xs font-semibold text-olive-mist flex items-center gap-1.5 cursor-pointer';
          modalThumbStandard.className = 'px-3 py-1.5 rounded-xl border border-mushroom-taupe/30 hover:border-olive-mist bg-warm-ivory text-xs font-medium text-smoky-clay flex items-center gap-1.5 cursor-pointer';
        }
      }
    }

    if (productId === 'gown-only') {
      if (modalThumbs) modalThumbs.classList.remove('hidden');
      if (modalArrowPrev) modalArrowPrev.classList.remove('hidden');
      if (modalArrowNext) modalArrowNext.classList.remove('hidden');

      const isDetails = displayImg.includes('details') || displayImg.includes('details.jpg');
      setModalPhoto(isDetails ? 'details' : 'standard');

      if (modalThumbStandard) {
        modalThumbStandard.onclick = (e) => {
          e.preventDefault();
          setModalPhoto('standard');
        };
      }
      if (modalThumbDetails) {
        modalThumbDetails.onclick = (e) => {
          e.preventDefault();
          setModalPhoto('details');
        };
      }
      if (modalArrowPrev) {
        modalArrowPrev.onclick = (e) => {
          e.preventDefault();
          setModalPhoto(modalCurrentView === 'standard' ? 'details' : 'standard');
        };
      }
      if (modalArrowNext) {
        modalArrowNext.onclick = (e) => {
          e.preventDefault();
          setModalPhoto(modalCurrentView === 'standard' ? 'details' : 'standard');
        };
      }
    } else {
      if (modalThumbs) modalThumbs.classList.add('hidden');
      if (modalArrowPrev) modalArrowPrev.classList.add('hidden');
      if (modalArrowNext) modalArrowNext.classList.add('hidden');
      if (modalImg) modalImg.src = displayImg;
    }

    if (modalTitle) modalTitle.textContent = data.title;
    if (modalSubtitle) modalSubtitle.textContent = data.subtitle;
    if (modalPrice) modalPrice.textContent = data.price;
    if (modalFabric) modalFabric.textContent = data.fabric;
    if (modalLeadTime) modalLeadTime.textContent = data.leadTime;
    if (modalDesc) modalDesc.textContent = data.description;

    // Show measurement guide link only for gowns
    if (modalMeasurementWrapper) {
      if (productId === 'gown-only' || productId === 'gown-with-ribbon') {
        modalMeasurementWrapper.classList.remove('hidden');
      } else {
        modalMeasurementWrapper.classList.add('hidden');
      }
    }

    if (modalOrderBtn) {
      modalOrderBtn.setAttribute('data-garment', data.title);
      modalOrderBtn.onclick = () => {
        closeDetailModal();
        const bookingModal = document.getElementById('booking-modal');
        const garmentSelect = document.getElementById('modal-garment-select');
        if (bookingModal) {
          bookingModal.classList.remove('hidden');
          bookingModal.classList.add('flex');
          document.body.classList.add('overflow-hidden');
          if (garmentSelect) {
            if (productId === 'ceremonial-suit') {
              garmentSelect.value = 'suit';
            } else if (productId === 'gown-only') {
              garmentSelect.value = 'gown-only';
            } else if (productId === 'ribbon-only') {
              garmentSelect.value = 'ribbon-only';
            } else {
              garmentSelect.value = 'gown-with-ribbon';
            }
            garmentSelect.dispatchEvent(new Event('change'));
          }
        }
      };
    }

    detailModal.classList.remove('hidden');
    detailModal.classList.add('flex');
    document.body.classList.add('overflow-hidden');
  }

  // Handle Size Guide Button click in Product Detail Modal
  if (modalSizeGuideBtn) {
    modalSizeGuideBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeDetailModal();
      const guideSection = document.getElementById('measurement-guide');
      if (guideSection) {
        guideSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Handle Return Policy Button click in Product Detail Modal
  const modalReturnPolicyBtn = document.getElementById('detail-modal-return-policy-btn');
  if (modalReturnPolicyBtn) {
    modalReturnPolicyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeDetailModal();
      const returnSection = document.getElementById('return-policy');
      if (returnSection) {
        returnSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  function closeDetailModal() {
    detailModal.classList.add('hidden');
    detailModal.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
  }

  viewDetailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productId = btn.getAttribute('data-product-id');
      openDetailModal(productId);
    });
  });

  closeDetailBtns.forEach(btn => {
    btn.addEventListener('click', closeDetailModal);
  });

  detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) {
      closeDetailModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !detailModal.classList.contains('hidden')) {
      closeDetailModal();
    }
  });
}

/* -------------------------------------------------------------------------- */
/* 5. Stats Intersection Observer                                             */
/* -------------------------------------------------------------------------- */
function initStatsObserver() {
  const statsSection = document.getElementById('heritage-stats');
  if (!statsSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statsSection.classList.add('opacity-100', 'translate-y-0');
        statsSection.classList.remove('opacity-0', 'translate-y-4');
        observer.unobserve(statsSection);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(statsSection);
}

/* -------------------------------------------------------------------------- */
/* 6. Interactive Size Calculator (Inches & Centimeters)                      */
/* -------------------------------------------------------------------------- */
function initSizeCalculator() {
  const calcBtn = document.getElementById('calc-btn');
  const lengthInput = document.getElementById('calc-length');
  const heightInput = document.getElementById('calc-height');
  const resultBox = document.getElementById('calc-result');
  const sizeBadge = document.getElementById('calc-size-badge');
  const sizeDesc = document.getElementById('calc-size-desc');
  const applyBtn = document.getElementById('calc-apply-btn');

  if (!calcBtn || !resultBox) return;

  function calculateSize() {
    let length = parseFloat(lengthInput.value);
    const height = parseFloat(heightInput.value);

    // If height provided but not length, approximate length = height * 0.70
    if ((!length || isNaN(length)) && height && !isNaN(height)) {
      length = Math.round(height * 0.70);
    }

    if (!length || isNaN(length)) {
      alert('กรุณากรอกความยาวที่วัดได้ หรือส่วนสูงของคุณเพื่อคำนวณไซส์');
      return;
    }

    // Convert cm to inches
    const lengthInches = Math.round(length / 2.54);
    let size = 'M';
    let desc = '';

    if (length <= 100) {
      size = `37 - 39 นิ้ว (ไซส์ S)`;
      desc = `ความยาวที่วัดได้ ${length} ซม. (~${lengthInches} นิ้ว) เหมาะสำหรับผู้ที่มีส่วนสูงประมาณ 150-158 ซม. ชายชุดครุยจะทิ้งตัวพอดีบริเวณกึ่งกลางน่อง`;
    } else if (length <= 107) {
      size = `40 - 42 นิ้ว (ไซส์ M)`;
      desc = `ความยาวที่วัดได้ ${length} ซม. (~${lengthInches} นิ้ว) เหมาะสำหรับผู้ที่มีส่วนสูงประมาณ 159-165 ซม. เป็นขนาดมาตรฐานที่สวมใส่กระชับพอดีตัว`;
    } else if (length <= 115) {
      size = `43 - 45 นิ้ว (ไซส์ L • ยอดนิยม)`;
      desc = `ความยาวที่วัดได้ ${length} ซม. (~${lengthInches} นิ้ว) เหมาะสำหรับผู้ที่มีส่วนสูงประมาณ 166-173 ซม. ทรงทิ้งตัวสง่างาม ชายครุยไม่เต่อและไม่กองพื้น`;
    } else if (length <= 123) {
      size = `46 - 48 นิ้ว (ไซส์ XL)`;
      desc = `ความยาวที่วัดได้ ${length} ซม. (~${lengthInches} นิ้ว) เหมาะสำหรับผู้ที่มีส่วนสูงประมาณ 174-182 ซม. สัดส่วนรอบคอและช่วงไหล่บาลานซ์ดีเยี่ยม`;
    } else {
      size = `49 - 52 นิ้ว (ไซส์ XXL / สั่งตัด)`;
      desc = `ความยาวที่วัดได้ ${length} ซม. (~${lengthInches} นิ้ว) แนะนำบริการสั่งตัดปรับตามสรีระพิเศษเพื่อความพอดีตัวและสง่างามสูงสุด`;
    }

    sizeBadge.textContent = size;
    sizeDesc.textContent = desc;
    resultBox.classList.remove('hidden');

    if (applyBtn) {
      applyBtn.onclick = () => {
        const bookingModal = document.getElementById('booking-modal');
        const garmentSelect = document.getElementById('modal-garment-select');
        const lengthSelect = document.getElementById('modal-length-select');
        const notes = document.getElementById('modal-notes');

        if (bookingModal) {
          bookingModal.classList.remove('hidden');
          bookingModal.classList.add('flex');
          document.body.classList.add('overflow-hidden');

          if (garmentSelect) {
            garmentSelect.value = 'gown-with-ribbon';
            garmentSelect.dispatchEvent(new Event('change'));
          }

          if (lengthSelect) {
            const closestInch = Math.max(37, Math.min(52, lengthInches));
            const optionToSelect = Array.from(lengthSelect.options).find(opt => opt.value.includes(`${closestInch} นิ้ว`));
            if (optionToSelect) {
              lengthSelect.value = optionToSelect.value;
            }
          }

          if (notes) {
            notes.value = `[คำนวณไซส์แล้ว: ${size}, วัดความยาวได้ ${length} ซม. (~${lengthInches} นิ้ว)]\n` + (notes.value || '');
          }
        }
      };
    }
  }

  calcBtn.addEventListener('click', calculateSize);
}

/* -------------------------------------------------------------------------- */
/* 7. Welcome Coupon Popup: 200 THB SPU Discount & Floating Widget            */
/* -------------------------------------------------------------------------- */
function showToastNotification(message, duration = 4000) {
  let toastContainer = document.getElementById('madame-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'madame-toast-container';
    toastContainer.className = 'fixed top-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto bg-smoky-clay text-white px-4 py-3 rounded-2xl shadow-2xl border border-mushroom-taupe/30 flex items-start gap-3 transform transition-all duration-300 translate-y-[-10px] opacity-0 text-xs';
  toast.innerHTML = `
    <div class="w-5 h-5 rounded-full bg-olive-mist flex items-center justify-center shrink-0 mt-0.5 text-white font-bold text-[10px]">
      ✓
    </div>
    <div class="flex-1 font-medium leading-relaxed">${message}</div>
  `;

  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-[-10px]', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-[-10px]', 'opacity-0');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
}

function initWelcomeCoupon() {
  const couponModal = document.getElementById('coupon-welcome-modal');
  const closeCouponBtn = document.getElementById('close-coupon-modal-btn');
  const claimAndOrderBtn = document.getElementById('claim-coupon-and-order-btn');
  const claimDismissBtn = document.getElementById('claim-coupon-dismiss-btn');
  const floatingWidget = document.getElementById('floating-coupon-widget');
  const openFloatingBtn = document.getElementById('open-floating-coupon-btn');
  const floatingBtnText = document.getElementById('floating-coupon-btn-text');

  if (!couponModal) return;

  let activePromoTier = localStorage.getItem('madame_gown_selected_tier') || 'solo';

  function updateTicketButtons() {
    const savedTier = localStorage.getItem('madame_gown_selected_tier') || activePromoTier;
    const isClaimed = localStorage.getItem('madame_gown_spu_coupon') === 'true';

    document.querySelectorAll('.btn-claim-ticket').forEach(btn => {
      const tier = btn.getAttribute('data-tier');
      const textSpan = btn.querySelector('.claim-text');
      if (isClaimed && tier === savedTier) {
        btn.classList.add('bg-emerald-700', 'text-white');
        btn.classList.remove('bg-olive-mist', 'bg-amber-600');
        if (textSpan) textSpan.textContent = 'เก็บแล้ว ✓';
      } else {
        if (textSpan) textSpan.textContent = 'กดเก็บคูปอง';
      }
    });
  }

  function updateFloatingButtonStatus() {
    const isClaimed = localStorage.getItem('madame_gown_spu_coupon') === 'true';
    if (floatingBtnText) {
      if (isClaimed) {
        floatingBtnText.textContent = 'คูปองลด ฿50-฿200 (เก็บแล้ว ✓)';
      } else {
        floatingBtnText.textContent = 'คูปองลด ฿50-฿200 ม.ศรีปทุม';
      }
    }
  }

  function openCouponModal() {
    couponModal.classList.remove('hidden');
    couponModal.classList.add('flex');
    document.body.classList.add('overflow-hidden');
    updateTicketButtons();
    if (window.lucide) window.lucide.createIcons();
  }

  function closeCouponModal() {
    couponModal.classList.add('hidden');
    couponModal.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
  }

  function claimCoupon(andOrder = false, specificTier = null) {
    if (specificTier) {
      activePromoTier = specificTier;
      localStorage.setItem('madame_gown_selected_tier', specificTier);
    }
    localStorage.setItem('madame_gown_spu_coupon', 'true');
    sessionStorage.setItem('madame_gown_coupon_dismissed', 'true');
    updateTicketButtons();
    updateFloatingButtonStatus();
    closeCouponModal();

    if (andOrder) {
      const tierNames = {
        solo: 'Welcome Code SPU50 (ลด ฿50)',
        duo: 'โปรมาคู่ SPUDUO (ลดคนละ ฿100)',
        squad: 'โปรแก๊ง 4 คน SPUSQUAD (ลดคนละ ฿200)'
      };
      showToastNotification(`เลือก ${tierNames[activePromoTier] || 'คูปองส่วนลด'} เรียบร้อยแล้ว! กำลังเปิดแบบฟอร์มคำสั่งซื้อ...`);

      const bookingModal = document.getElementById('booking-modal');
      const garmentSelect = document.getElementById('modal-garment-select');
      const serviceSelect = document.getElementById('modal-service-select');

      if (bookingModal) {
        bookingModal.classList.remove('hidden');
        bookingModal.classList.add('flex');
        document.body.classList.add('overflow-hidden');

        if (garmentSelect) {
          garmentSelect.value = 'gown-with-ribbon';
          garmentSelect.dispatchEvent(new Event('change'));
        }
        if (serviceSelect) {
          serviceSelect.value = 'เช่า';
          serviceSelect.dispatchEvent(new Event('change'));
        }
        const promoTierSelect = document.getElementById('modal-promo-tier');
        if (promoTierSelect) {
          promoTierSelect.value = activePromoTier;
          promoTierSelect.dispatchEvent(new Event('change'));
        }
      }
    } else {
      showToastNotification('เก็บคูปองส่วนลดไว้ให้คุณแล้ว! ระบบจะนำไปคำนวณส่วนลดให้อัตโนมัติเมื่อสั่งเช่าชุดค่ะ');
    }
  }

  // Handle individual coupon claim buttons
  document.querySelectorAll('.btn-claim-ticket').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tier = btn.getAttribute('data-tier') || 'solo';
      const code = btn.getAttribute('data-code') || 'SPU50';
      activePromoTier = tier;
      localStorage.setItem('madame_gown_selected_tier', tier);
      localStorage.setItem('madame_gown_spu_coupon', 'true');
      sessionStorage.setItem('madame_gown_coupon_dismissed', 'true');
      updateTicketButtons();
      updateFloatingButtonStatus();

      if (tier === 'solo') {
        showToastNotification(`🎉 เก็บ Welcome Code ${code} (ลดทันที ฿50) เรียบร้อยแล้ว!`);
      } else if (tier === 'duo') {
        showToastNotification(`👥 เก็บสิทธิ์จองคู่ ${code} (ลดคนละ ฿100) เรียบร้อยแล้ว!`);
      } else if (tier === 'squad') {
        showToastNotification(`🔥 เก็บสิทธิ์แก๊ง 4 คน ${code} (ลดคนละ ฿200) เรียบร้อยแล้ว!`);
      }
    });
  });

  // Attach open modal listener to ALL .open-coupon-modal buttons (top-right button, bottom promo strip, floating widget)
  document.querySelectorAll('.open-coupon-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCouponModal();
    });
  });

  // Expose globally for any other scripts
  window.openCouponModal = openCouponModal;

  function updateFloatingButtonStatus() {
    const isClaimed = localStorage.getItem('madame_gown_spu_coupon') === 'true';
    if (floatingBtnText) {
      if (isClaimed) {
        floatingBtnText.textContent = 'คูปองลด ฿50-฿200 (เก็บแล้ว ✓)';
      } else {
        floatingBtnText.textContent = 'คูปองลด ฿50-฿200 ม.ศรีปทุม';
      }
    }
  }

  function openCouponModal() {
    couponModal.classList.remove('hidden');
    couponModal.classList.add('flex');
    document.body.classList.add('overflow-hidden');
    if (window.lucide) window.lucide.createIcons();
  }

  function closeCouponModal() {
    couponModal.classList.add('hidden');
    couponModal.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
  }

  function claimCoupon(andOrder = false) {
    localStorage.setItem('madame_gown_spu_coupon', 'true');
    sessionStorage.setItem('madame_gown_coupon_dismissed', 'true');
    updateFloatingButtonStatus();
    closeCouponModal();

    if (andOrder) {
      showToastNotification('เก็บสิทธิ์ส่วนลด SPU50 เรียบร้อยแล้ว! กำลังเปิดแบบฟอร์มคำสั่งซื้อ...');
      const bookingModal = document.getElementById('booking-modal');
      const garmentSelect = document.getElementById('modal-garment-select');
      const serviceSelect = document.getElementById('modal-service-select');

      if (bookingModal) {
        bookingModal.classList.remove('hidden');
        bookingModal.classList.add('flex');
        document.body.classList.add('overflow-hidden');

        if (garmentSelect) {
          garmentSelect.value = 'gown-with-ribbon';
          garmentSelect.dispatchEvent(new Event('change'));
        }
        if (serviceSelect) {
          serviceSelect.value = 'เช่า';
          serviceSelect.dispatchEvent(new Event('change'));
        }
        const promoTierSelect = document.getElementById('modal-promo-tier');
        if (promoTierSelect) {
          promoTierSelect.value = 'solo';
          promoTierSelect.dispatchEvent(new Event('change'));
        }
      }
    } else {
      showToastNotification('เก็บโค้ดส่วนลด SPU50 ไว้ให้คุณแล้ว! ระบบจะนำไปหักลดอัตโนมัติเมื่อสั่งเช่าชุดค่ะ');
    }
  }

  // Auto show coupon popup after 1000ms if not dismissed in this session
  const couponUrlParams = new URLSearchParams(window.location.search);
  const isDismissed = sessionStorage.getItem('madame_gown_coupon_dismissed') === 'true' || couponUrlParams.get('no_coupon') === '1';
  if (!isDismissed) {
    setTimeout(() => {
      // Check if user hasn't already opened another modal
      const bookingModal = document.getElementById('booking-modal');
      const detailModal = document.getElementById('product-detail-modal');
      const isBookingOpen = bookingModal && !bookingModal.classList.contains('hidden');
      const isDetailOpen = detailModal && !detailModal.classList.contains('hidden');

      if (!isBookingOpen && !isDetailOpen) {
        openCouponModal();
      }
    }, 1000);
  }

  updateFloatingButtonStatus();

  // Event Listeners
  if (closeCouponBtn) {
    closeCouponBtn.addEventListener('click', () => {
      // Still store coupon for courtesy
      localStorage.setItem('madame_gown_spu_coupon', 'true');
      sessionStorage.setItem('madame_gown_coupon_dismissed', 'true');
      updateFloatingButtonStatus();
      closeCouponModal();
    });
  }

  if (claimAndOrderBtn) {
    claimAndOrderBtn.addEventListener('click', () => claimCoupon(true));
  }

  if (claimDismissBtn) {
    claimDismissBtn.addEventListener('click', () => claimCoupon(false));
  }

  if (openFloatingBtn) {
    openFloatingBtn.addEventListener('click', openCouponModal);
  }

  couponModal.addEventListener('click', (e) => {
    if (e.target === couponModal) {
      localStorage.setItem('madame_gown_spu_coupon', 'true');
      sessionStorage.setItem('madame_gown_coupon_dismissed', 'true');
      updateFloatingButtonStatus();
      closeCouponModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !couponModal.classList.contains('hidden')) {
      closeCouponModal();
    }
  });
}

/* -------------------------------------------------------------------------- */
/* 8. Persistent Floating Order CTA Button                                    */
/* -------------------------------------------------------------------------- */
function initFloatingOrderButton() {
  const floatingBtn = document.getElementById('floating-order-btn');
  if (!floatingBtn) return;

  floatingBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById('product-grid') || document.getElementById('catalog');
    if (target) {
      const headerOffset = 90;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
}

/* -------------------------------------------------------------------------- */
/* Gallery Infinite Marquee Slider (ผลงานและบรรยากาศจริง สไลด์ไปเรื่อยๆ)        */
/* -------------------------------------------------------------------------- */
function initGalleryMarquee() {
  const track = document.getElementById('gallery-marquee-track');
  if (!track) return;

  // Explicit inline styling fallback to guarantee horizontal display
  track.style.display = 'flex';
  track.style.flexDirection = 'row';
  track.style.flexWrap = 'nowrap';
  track.style.width = 'max-content';

  // Desktop hover pause
  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });

  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });

  // Mobile touch pause
  track.addEventListener('touchstart', () => {
    track.style.animationPlayState = 'paused';
  }, { passive: true });

  track.addEventListener('touchend', () => {
    setTimeout(() => {
      track.style.animationPlayState = 'running';
    }, 1500);
  }, { passive: true });
}

/* -------------------------------------------------------------------------- */
/* Interactive Gown Only Hover-Pan & Dual Photo Switcher                      */
/* (เลื่อนเมาส์ชี้ขึ้น-ลง เพื่อดูภาพเต็มไม่ถูกตัด + สลับดูรูป Standard และ Details) */
/* -------------------------------------------------------------------------- */
function initGownOnlyHoverPan() {
  const container = document.getElementById('gown-only-img-container');
  const img = document.getElementById('card-gown-only-img');
  const btnPrev = document.getElementById('btn-gown-prev');
  const btnNext = document.getElementById('btn-gown-next');
  const dot0 = document.getElementById('gown-dot-0');
  const dot1 = document.getElementById('gown-dot-1');
  const indicatorIcon = document.getElementById('gown-indicator-icon');
  const indicatorText = document.getElementById('gown-indicator-text');
  const hoverHint = document.getElementById('gown-only-hover-hint');

  // Backward-compat elements if present
  const btnStandard = document.getElementById('btn-switch-gown-standard');
  const btnDetails = document.getElementById('btn-switch-gown-details');

  if (!container || !img) return;

  const PHOTOS = {
    standard: 'assets/images/products/gown_standard.jpg',
    details: 'assets/images/products/gown standard details.jpg'
  };

  const VIEWS = ['standard', 'details'];
  let activeIndex = 0; // 0 = standard, 1 = details
  let activeView = 'standard';
  let isHovered = false;

  function updateView(view) {
    activeView = view;
    activeIndex = view === 'standard' ? 0 : 1;
    img.style.transition = 'opacity 0.2s ease, transform 0.3s ease-out';
    img.style.opacity = '0.35';

    setTimeout(() => {
      img.src = PHOTOS[view];

      if (view === 'standard') {
        img.className = 'w-full h-auto min-h-[125%] object-cover object-top select-none pointer-events-none transition-transform duration-100 ease-out will-change-transform';
        if (indicatorIcon) indicatorIcon.innerHTML = '<i data-lucide="camera" class="w-3.5 h-3.5 text-olive-mist"></i>';
        if (indicatorText) indicatorText.textContent = '1/2 ทรงเต็มตัว (Standard)';
        if (hoverHint) hoverHint.textContent = 'ชี้เมาส์เลื่อนขึ้น-ลง เพื่อดูภาพเต็ม';
        if (dot0) dot0.className = 'w-4 h-1.5 rounded-full bg-white transition-all cursor-pointer';
        if (dot1) dot1.className = 'w-1.5 h-1.5 rounded-full bg-white/50 hover:bg-white/80 transition-all cursor-pointer';
      } else {
        // Details view (Infographic with 5 panels)
        img.className = 'w-full h-full object-contain p-2 select-none pointer-events-none transition-transform duration-100 ease-out will-change-transform';
        if (indicatorIcon) indicatorIcon.innerHTML = '<i data-lucide="zoom-in" class="w-3.5 h-3.5 text-olive-mist"></i>';
        if (indicatorText) indicatorText.textContent = '2/2 เจาะลึก 5 จุด (Details)';
        if (hoverHint) hoverHint.textContent = 'เจาะลึก 5 จุด: คอเสื้อ, ซิปหน้า-หลัง, จีบไหล่';
        if (dot0) dot0.className = 'w-1.5 h-1.5 rounded-full bg-white/50 hover:bg-white/80 transition-all cursor-pointer';
        if (dot1) dot1.className = 'w-4 h-1.5 rounded-full bg-white transition-all cursor-pointer';
      }

      // Backward compatibility buttons if present
      if (btnStandard) {
        btnStandard.className = view === 'standard'
          ? 'gown-only-view-btn px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all bg-olive-mist text-white shadow-xs cursor-pointer flex items-center gap-1'
          : 'gown-only-view-btn px-2.5 py-1 rounded-lg text-[10.5px] font-medium text-smoky-clay/80 hover:text-smoky-clay transition-all cursor-pointer flex items-center gap-1';
      }
      if (btnDetails) {
        btnDetails.className = view === 'details'
          ? 'gown-only-view-btn px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all bg-olive-mist text-white shadow-xs cursor-pointer flex items-center gap-1'
          : 'gown-only-view-btn px-2.5 py-1 rounded-lg text-[10.5px] font-medium text-smoky-clay/80 hover:text-smoky-clay transition-all cursor-pointer flex items-center gap-1';
      }

      img.style.opacity = '1';
      resetPan();
      if (window.lucide) window.lucide.createIcons();
    }, 140);
  }

  function nextPhoto() {
    const nextIdx = (activeIndex + 1) % VIEWS.length;
    updateView(VIEWS[nextIdx]);
  }

  function prevPhoto() {
    const prevIdx = (activeIndex - 1 + VIEWS.length) % VIEWS.length;
    updateView(VIEWS[prevIdx]);
  }

  // Arrow Event Listeners
  if (btnNext) {
    btnNext.addEventListener('click', (e) => {
      e.stopPropagation();
      nextPhoto();
    });
  }
  if (btnPrev) {
    btnPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      prevPhoto();
    });
  }

  // Dot Event Listeners
  if (dot0) {
    dot0.addEventListener('click', (e) => {
      e.stopPropagation();
      updateView('standard');
    });
  }
  if (dot1) {
    dot1.addEventListener('click', (e) => {
      e.stopPropagation();
      updateView('details');
    });
  }

  // Backward compatibility pill listeners
  if (btnStandard) {
    btnStandard.addEventListener('click', (e) => {
      e.stopPropagation();
      updateView('standard');
    });
  }
  if (btnDetails) {
    btnDetails.addEventListener('click', (e) => {
      e.stopPropagation();
      updateView('details');
    });
  }

  // Mobile Touch Swipe support
  let touchStartX = 0;
  let touchStartY = 0;
  container.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    const diffX = e.changedTouches[0].clientX - touchStartX;
    const diffY = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        nextPhoto();
      } else {
        prevPhoto();
      }
    }
  }, { passive: true });

  function resetPan() {
    img.style.transition = 'transform 0.4s ease-out';
    if (activeView === 'standard') {
      img.style.transform = 'translateY(0)';
    } else {
      img.style.transform = 'scale(1) translate(0, 0)';
    }
  }

  container.addEventListener('mouseenter', () => {
    isHovered = true;
    img.style.transition = 'transform 0.08s ease-out';
  });

  container.addEventListener('mousemove', (e) => {
    if (!isHovered) return;
    const rect = container.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const mouseX = e.clientX - rect.left;

    const yRatio = Math.max(0, Math.min(1, mouseY / rect.height));
    const xRatio = Math.max(0, Math.min(1, mouseX / rect.width));

    if (activeView === 'standard') {
      // Vertical pan for full-length gown photo
      const overflowY = img.offsetHeight - container.offsetHeight;
      if (overflowY > 0) {
        const translateY = - (yRatio * overflowY);
        img.style.transform = `translateY(${translateY}px)`;
      }
    } else {
      // Zoom and subtle pan for 5-point details infographic
      const panX = (0.5 - xRatio) * 40;
      const panY = (0.5 - yRatio) * 40;
      img.style.transform = `scale(1.12) translate(${panX}px, ${panY}px)`;
    }
  });

  container.addEventListener('mouseleave', () => {
    isHovered = false;
    resetPan();
  });

  // URL test parameters for screenshots and direct inspection
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('gown_view') === 'details') {
    updateView('details');
  }
  if (urlParams.get('pan') === 'bottom') {
    setTimeout(() => {
      const overflowY = img.offsetHeight - container.offsetHeight;
      if (overflowY > 0) {
        img.style.transform = `translateY(-${overflowY}px)`;
      }
    }, 400);
  }
  if (urlParams.get('scroll_to') === 'card3') {
    setTimeout(() => {
      document.getElementById('card-gown-only')?.scrollIntoView({ behavior: 'instant', block: 'center' });
    }, 200);
  }
}
