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
    box: $(".header"),
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
      closeBut: $(".header__search__input__close"),
      searchBut: $(".header__search__but"),
      backgroundPage: "<div class='header__bg bg_search'></div>",
      basicTimeAnimate: 600,
      _appendBg: function() {
        var _this = this;
        this.parent.box.find(".header__bg").remove();
        this.parent.box.append(this.backgroundPage);
        var bg = this.parent.box.find(".header__bg.bg_search");
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
        var bg = this.parent.box.find(".header__bg.bg_search");
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
        this.parent.box.toggleClass("searchOpen");
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
          _this.parent.box.toggleClass("searchOpen");
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
        this.parent.box = $(".header");
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
      animate: false,
      but: $(".header__mobile__burger"),
      menu: $(".header__mobileMenu"),
      backgroundPage: "<div class='header__bg bg_burger'></div>",
      basicTimeAnimate: 600,
      language: {
        state: "closed",
        but: $(".header__mobileMenu__lang__title"),
        wrapper: $(".header__mobileMenu__lang__wrapper"),
        list: $(".header__mobileMenu__lang__list"),
        items: null,
        animate: false,
        basicTimeAnimate: 500,
        basicDelay: 100,
        _events: function() {
          var _this = this;
          this.but.click(function(e) {
            e.preventDefault();
            if (!_this.animate) {
              if (_this.state === "closed") {
                _this.open();
              } else {
                _this.close();
              }
            }
          });
        },
        open: function() {
          this.animate = true;
          this.but.parent().addClass("active");
          this.wrapper.addClass("open");
          var _this = this;
          setTimeout(function() {
            _this.showElements();
          }, this.basicTimeAnimate * 2);
          this.state = "opened";
        },
        showElements: function() {
          var _this = this;
          for (var i = 0; i < _this.items.length; i++) {
            _this.items
              .eq(i)
              .delay(_this.basicDelay * (_this.items.length - i - 1))
              .fadeIn(_this.basicTimeAnimate);
            console.log(_this.basicDelay * (_this.items.length - i - 1));
          }
          setTimeout(function() {
            _this.animate = false;
          }, _this.basicDelay * this.items.length);
        },
        close: function() {
          var _this = this;
          _this.hideElements(function() {
            _this.but.parent().removeClass("active");
            _this.wrapper.removeClass("open");
          });
          this.state = "closed";
        },
        hideElements: function(callBack = function() {}) {
          var _this = this;
          for (var i = 0; i < _this.items.length; i++) {
            _this.items
              .eq(i)
              .delay(_this.basicDelay * i)
              .fadeOut(_this.basicTimeAnimate);
            console.log(_this.basicDelay * i);
          }
          setTimeout(function() {
            setTimeout(function() {
              callBack();
            }, _this.basicTimeAnimate * 2);
            _this.animate = false;
          }, _this.basicDelay * this.items.length-1);
        },
        init: function() {
          this.but = $(".header__mobileMenu__lang__title");
          this.wrapper = $(".header__mobileMenu__lang__wrapper");
          this.list = $(".header__mobileMenu__lang__list");
          this.items = this.list.find(".header__mobileMenu__lang__item");
          this.items.fadeOut();
          this, this._events();
        }
      },
      _appendBg: function() {
        var _this = this;
        this.parent.box.find(".header__bg").remove();
        this.parent.box.append(this.backgroundPage);
        var bg = this.parent.box.find(".header__bg.bg_burger");
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
      _removeBg: function(callback = function() {}) {
        var _this = this;
        var bg = this.parent.box.find(".header__bg.bg_burger");
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
        this.parent.box.addClass("burgerOpen");
        this.menu.animate(
          {
            opacity: 1
          },
          this.basicTimeAnimate
        );
        this._appendBg();
      },
      close: function() {
        var _this = this;
        this.menu.animate(
          {
            opacity: 0
          },
          this.basicTimeAnimate,
          function() {
            _this.menu.removeClass("open");
            _this._removeBg();
            _this.parent.box.removeClass("burgerOpen");
          }
        );
      },
      init: function() {
        this.but = $(".header__mobile__burger");
        this.menu = $(".header__mobileMenu");
        this.language.init();
        this._events();
      }
    },
    init: function() {
      this.srcrollFix.parent = this;
      this.search.parent = this;
      this.scrolling.parent = this;
      this.burger.parent = this;
      this.box = $(".header");

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
