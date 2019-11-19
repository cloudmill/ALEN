$(document).ready(function() {
  init_js();
});
var init_js = function() {
  templs.init();
  pages.init();
};
var templs = {
  header: {
    usersNoScroll: 0,
    srcrollFix: {
      del: function() {
        this.parent.usersNoScroll--;
        if (this.parent.usersNoScroll === 0) {
          $("body").removeClass("scrollDis");
        }
      },
      add: function() {
        this.parent.usersNoScroll++;
        $("body").addClass("scrollDis");
      }
    },
    search: {
      state: "closed",
      animate: false,
      box: $(".header__search__wrapper"),
      parentBox: $(".header"),
      closeBut: $(".header__search__input__close"),
      searchBut: $(".header__search__but"),
      backgroundPage: "<div class='header__bg bg_search'></div>",
      basicTimeAnimate: 600,
      _appendBg: function() {
        var _this = this;
        this.parentBox.find(".header__bg").remove();
        this.parentBox.append(this.backgroundPage);
        var bg = this.parentBox.find(".header__bg.bg_search");
        bg.css("display", "block");
        bg.animate(
          {
            opacity: 1
          },
          this.basicTimeAnimate,
          "linear",
          function() {
            _this.animate = false;
            _this.state = "opened";
          }
        );
      },
      _removeBg: function(callback) {
        var _this = this;
        var bg = this.parentBox.find(".header__bg.bg_search");
        bg.animate(
          {
            opacity: 0
          },
          this.basicTimeAnimate,
          "linear",
          function() {
            bg.remove();
            _this.animate = false;
            _this.state = "closed";
            callback();
          }
        );
      },
      open: function() {
        this.parent.srcrollFix.add();
        this.animate = true;
        this.parentBox.toggleClass("searchOpen");
        this.box.toggleClass("open");
        var _this = this;
        setTimeout(function() {
          _this._appendBg();
        }, this.basicTimeAnimate - 50);
      },
      close: function() {
        this.parent.srcrollFix.del();
        var _this = this;
        this.animate = true;
        this.box.toggleClass("open");
        this._removeBg(function() {
          _this.parentBox.toggleClass("searchOpen");
        });
        
      },
      _events: function() {
        var _this = this;
        this.searchBut.click(function(e) {
          e.preventDefault();
          if (!_this.animate) {
            if (_this.state === "closed") _this.open();
            else if (_this.state === "opened") {
              _this.close();
            }
          }
        });
        this.closeBut.click(function(e) {
          e.preventDefault();
          if (_this.state === "opened") {
            _this.close();
          }
        });
      },
      init: function() {
        this.box = $(".header__search__wrapper");
        this.parentBox = $(".header");
        this.closeBut = $(".header__search__input__close");
        this.searchBut = $(".header__search__but");
        this._events();
      }
    },
    scrolling: {
      header: $(".header"),
      dMove: 20,
      oldScroll: 0,
      _events: function() {
        var _this = this;
        $(document).scroll(function() {
          _this._doing($(this).scrollTop());
        });
      },
      _doing: function(scrollTop) {
        if (
          this.dMove < Math.abs(scrollTop - this.oldScroll) ||
          scrollTop == 0
        ) {
          if (this.oldScroll < scrollTop) {
            if (scrollTop > this.header.height()) {
              this.header.addClass("hide");
              this.header.addClass("scrolled");
            }
          } else {
            if (scrollTop > this.header.height()) {
              this.header.removeClass("hide");
              this.header.addClass("scrolled");
            }
          }
          if (scrollTop == 0) {
            this.header.removeClass("scrolled");
          }
          this.oldScroll = scrollTop;
        }
        if (scrollTop == 0) {
          this.header.removeClass("scrolled");
        }
      },
      init: function() {
        this.header = $(".header");
        this._events();
      }
    },
    burger: {
      state: "closed",
      but: $(".header__mobile__burger"),
      menu: $(".header__mobileMenu"),
      baseTimeAnimation: 500,
      _events: function() {
        var _this = this;
        this.but.click(function(e) {
          e.preventDefault();
          if (_this.state === "closed") {
            _this.parent.srcrollFix.add();
            _this.open();
          } else {
            _this.close();
            _this.parent.srcrollFix.del();
          }
        });
      },
      open: function() {
        this.menu.addClass("open");
        this.menu.animate(
          {
            opacity: 1
          },
          this.baseTimeAnimation
        );
      },
      close: function() {
        this.menu.animate(
          {
            opacity: 1
          },
          this.baseTimeAnimation,
          function() {
            this.menu.removeClass("open");
          }
        );
      },
      init: function() {
        this.but = $(".header__mobile__burger");
        this.menu = $(".header__mobileMenu");
        this._events();
      }
    },
    init: function() {
      this.srcrollFix.parent = this;
      this.search.parent = this;
      this.scrolling.parent = this;
      this.burger.parent = this;

      this.search.init();
      this.scrolling.init();
      this.burger.init();
    }
  },
  init: function() {
    this.header.init();
  }
};
var pages = {
  main: {
    slider: {
      boxClass: "fpSlider",
      labelsClass: "fpSlider__labels",
      bgs: null,
      texts: null,
      videoMuted: false,
      videos: $(this.box).find("video"),
      _mouteInit: function() {
        var _this = this;
        $(".fpSlider__moute").click(function() {
          $(this).toggleClass("active");
          _this.videoMuted = $(".fpSlider__moute").hasClass("active");
          _this.volumeVideo(_this.videoMuted);
          if (_this.videoMuted) {
            $(this).text("Выкл. звук");
            _this.videos.each(function() {
              _this.moute = true;
            });
          } else {
            $(this).text("Вкл. звук");
          }
        });
      },
      volumeVideo: function(moute) {
        if (this.videos.length > 0) {
          if (!moute) {
            this.videos.each(function() {
              this.moute = true;
            });
            if (this.videos.eq(this.activeIndex - 1).length > 0) {
              this.videos.eq(this.activeIndex - 1)[0].moute = false;
              console.log(this.videos.eq(this.activeIndex - 1)[0].moute);
            }
          }
        }
      },
      sliderCreate: function() {
        var _this = this;
        if ($("." + this.boxClass).length > 0) {
          this.bgs = new Swiper("." + this.boxClass, {
            loop: true,
            autoplay: {
              delay: 9500,
              disableOnInteraction: false
            },
            speed: 1000,
            on: {
              init: function(e) {
                _this.volumeVideo(_this.videoMuted);
              },
              slideChange: function() {
                _this.volumeVideo(_this.videoMuted);
              }
            },
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev"
            },
            pagination: {
              el: ".swiper-pagination",
              type: "bullets",
              clickable: true
            }
          });
          this.texts = new Swiper("." + this.labelsClass, {
            touchRatio: 0.2,
            slideToClickedSlide: true,
            loop: true,
            speed: 500,
            effect: "coverflow",
            coverflowEffect: {
              rotate: 0,
              slideShadows: true
            }
          });
          this.bgs.controller.control = this.texts;
          this.texts.controller.control = this.bgs;
        }
      },
      init: function() {
        this.videos = $(this.box).find("video");
        this.sliderCreate();
        this._mouteInit();
      }
    },
    init: function() {
      this.slider.init();
    }
  },
  init: function() {
    this.main.init();
  }
};
