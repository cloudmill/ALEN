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
    box: null,
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
      box: null,
      closeBut: null,
      searchBut: null,
      backgroundPage: "<div class='header_bg bg_search'></div>",
      basicTimeAnimate: 600,
      mobileSearchBut: null,
      _appendBg: function() {
        var _this = this;
        //this.parent.box.find(".header_bg").remove();
        this.parent.box.append(this.backgroundPage);
        var bg = this.parent.box.find(".header_bg.bg_search");
        bg.css("display", "block");
        $(".header_mobile_search").animate(
          {
            opacity: 1
          },
          this.basicTimeAnimate,
          "linear"
        );
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
        var bg = this.parent.box.find(".header_bg.bg_search");
        $(".header_mobile_search").animate(
          {
            opacity: 0
          },
          this.basicTimeAnimate,
          "linear"
        );
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
          $(".header_mobileMenu").animate({ opacity: 1 });
          _this.parent.box.toggleClass("searchOpen");
        });
      },
      events: function() {
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
        this.mobileSearchBut.click(function(e) {
          if ($(window).width() <= 1024) {
            e.preventDefault();
            if (!_this.animate) {
              if (_this.state === "closed") {
                $(".header_mobileMenu").animate({ opacity: 0 });
                _this.open();
              }
            }
          }
        });
        $(".header_mobile_search").click(function(e) {
          if ($(window).width() <= 1024) {
            e.preventDefault();
            if (!_this.animate) {
              if (_this.state === "opened") {
                if ($(".header_mobileMenu").hasClass("open")) _this.close();
              }
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
        this.box = $(".header_search_wrapper");
        this.parent.box = $(".header");
        this.closeBut = $(".header_search_input_close");
        this.searchBut = $(".header_search_but");
        this.mobileSearchBut = $(".header_mobileMenu_search");
        this.events();
      }
    },
    scrolling: {
      header: $(".header"),
      dMove: 20,
      oldScroll: 0,
      events: function() {
        var _this = this;
        $(document).scroll(function() {
          _this._doing($(this).scrollTop());
        });
      },
      _doing: function(scrollTop, firstInit = false) {
        if (
          this.dMove < Math.abs(scrollTop - this.oldScroll) ||
          scrollTop == 0 ||
          firstInit
        ) {
          if (this.oldScroll < scrollTop) {
            if (scrollTop > this.header.height()) {
              this.header.addClass("hide");
              this.header.addClass("scrolled");
            }
          } else {
            if (scrollTop > this.header.height() || firstInit) {
              this.header.removeClass("hide");
              this.header.addClass("scrolled");
            }
          }
          if (scrollTop == 0) {
            if (!this.header.hasClass("scrolled-ever"))
              this.header.removeClass("scrolled");
          }
          this.oldScroll = scrollTop;
        }
        if (scrollTop == 0) {
          if (!this.header.hasClass("scrolled-ever"))
            this.header.removeClass("scrolled");
        }
      },
      init: function() {
        this.header = $(".header");
        this.events();
        this.oldScroll = $(document).scrollTop();
        this._doing($(document).scrollTop(), true);
      }
    },
    burger: {
      state: "closed",
      animate: false,
      but: $(".header_mobile_burger"),
      menu: $(".header_mobileMenu"),
      backgroundPage: "<div class='header_bg bg_burger'></div>",
      basicTimeAnimate: 600,
      basicDelay: 50,
      language: {
        state: "closed",
        but: $(".header_mobileMenu_lang_title"),
        wrapper: $(".header_mobileMenu_lang_wrapper"),
        list: $(".header_mobileMenu_lang_list"),
        items: null,
        animate: false,
        basicTimeAnimate: 500,
        basicDelay: 100,
        events: function() {
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
          }
          setTimeout(function() {
            setTimeout(function() {
              callBack();
            }, _this.basicTimeAnimate * 2);
            _this.animate = false;
          }, _this.basicDelay * (this.items.length - 1));
        },
        init: function() {
          this.but = $(".header_mobileMenu_lang_title");
          this.wrapper = $(".header_mobileMenu_lang_wrapper");
          this.list = $(".header_mobileMenu_lang_list");
          this.items = this.list.find(".header_mobileMenu_lang_item");
          this.items.fadeOut();
          this, this.events();
        }
      },
      _appendBg: function() {
        var _this = this;
        this.parent.box.find(".header_bg").remove();
        this.parent.box.append(this.backgroundPage);
        var bg = this.parent.box.find(".header_bg.bg_burger");
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
        var bg = this.parent.box.find(".header_bg.bg_burger");
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
      events: function() {
        var _this = this;
        this.but.click(function(e) {
          e.preventDefault();
          if (!_this.animate) {
            _this.animate = true;
            if (_this.state === "closed") {
              _this.parent.srcrollFix.add();
              _this.open();
            } else {
              _this.close();
              _this.parent.srcrollFix.del();
            }
          }
        });
        $(window).on("resize", function() {
          if (_this.state === "opened" && $(window).width() > 1024) {
            _this.close();
          }
        });
      },
      _elementsFadeIn: function() {
        var _this = this;
        var num = 0;
        var fadeInEl = setInterval(() => {
          if (num < $(".header_mobileMenu_item").length) {
            $(".header_mobileMenu_item").eq(num).addClass("faded");
            num++;
          } else {
            clearInterval(fadeInEl);
          }
        }, _this.basicDelay);
      },
      _elementsFadeOut: function(callback = function() {}) {
        var _this = this;
        var num = $(".header_mobileMenu_item").length - 1;
        var fadeOutEl = setInterval(() => {
          if (num >= 0) {
            $(".header_mobileMenu_item").eq(num).removeClass("faded");
            num--;
          } else {
            callback();
            clearInterval(fadeOutEl);
          }
        }, _this.basicDelay);
      },
      open: function() {
        this.menu.addClass("open");
        this.parent.box.addClass("burgerOpen");
        var _this = this;
        $(".header_mobileMenu_item");
        this._elementsFadeIn();
        _this.menu.animate(
          {
            opacity: 1
          },
          _this.basicTimeAnimate
        );
        this._appendBg();
      },
      close: function() {
        var _this = this;
        this.language.close();
        _this._elementsFadeOut(function() {
          _this.menu.removeClass("open");
        });
        this.menu.animate(
          {
            opacity: 0
          },
          this.basicTimeAnimate,
          function() {
            _this._removeBg();
            _this.parent.box.removeClass("burgerOpen");
          }
        );
      },
      init: function() {
        this.but = $(".header_mobile_burger");
        this.menu = $(".header_mobileMenu");
        this.language.init();
        this.events();
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
  footer: {
    box: null,
    menus: null,
    events: function() {
      var _this = this;
      this.menus.click(function() {
        if ($(window).width() <= 1024) {
          if ($(this).hasClass("active")) {
            _this.close($(this));
          } else {
            _this.open($(this));
          }
        }
      });
    },
    open: function(targetC) {
      targetC.addClass("active");
      var tempH = targetC.find(".footer_menu").height() + targetC.height();
      targetC.height(tempH);
    },
    close: function(targetC) {
      targetC.removeClass("active");
      targetC.height(50);
    },
    init: function() {
      this.box = $(".footer");
      this.menus = $(".footer_menu_wrapper");

      this.events();
    }
  },
  init: function() {
    this.header.init();
    this.footer.init();
  }
};
var pages = {
  main: {
    slider: {
      boxClass: "fpSlider",
      labelsClass: "fpSlider_labels",
      bgs: null,
      texts: null,
      videoMuted: false,
      videos: $(this.box).find("video"),
      _mouteInit: function() {
        var _this = this;
        $(".fpSlider_moute").click(function() {
          $(this).toggleClass("active");
          _this.videoMuted = $(".fpSlider_moute").hasClass("active");
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
  projects: {
    items: null,
    basicDelay: 400,
    index: 0,
    loaded: false,
    intrvl: [],
    bgSet: function() {
      this.items.each(function() {
        var container = this.querySelector(".projects_item_loadBg");
        var img = this.querySelector(".projects_item_img");
        $.ajax({
          url: "colorCalc.php",
          type: "POST",
          data: {
            src: $(img).attr("data-src")
          },
          success: function(rgb) {
            $(container).css("background", rgb);
          }
        });
      });
    },
    showImg: function() {
      this.index = 0;
      _this = this;
      var y = 0;
      this.items.each(function() {
        var $this = $(this);
        if (
          $(document).scrollTop() + $(window).height() >
          $(this).offset().top
        ) {
          if (!_this.intrvl[y]) {
            _this.intrvl[y] = setTimeout(function() {
              if ($this.hasClass("is-hidden")) {
                _this.imageLoad($this);
              }
            }, _this.index * _this.basicDelay);
          }

          if ($this.hasClass("is-hidden")) _this.index++;
        }
        y++;
      });
    },
    imageLoad: function($this) {
      $this.removeClass("is-hidden");
      $this.addClass("is-proccess");
      $this.append("<span class='loadMonitor show'></span>");
      $this.find(".projects_item_img").load(
        $this.find(".projects_item_img").attr("data-src"),
        //callback
        function() {
          $(this).attr("src", $(this).attr("data-src"));
          $this.addClass("is-loaded");
          $this.find(".loadMonitor").removeClass("show");
          setTimeout(function() {
            $this.removeClass("is-proccess");
            $this.find(".loadMonitor").remove();
          }, 500);
        }
      );
    },
    events: function() {
      _this = this;
      var loaded = false;
      $(document).on("scroll", function() {
        _this.showImg();
      });
      _this.showImg();
    },
    init: function() {
      this.items = $(".projects_item");
      this.bgSet();
      this.events();
    }
  },
  projectsDetail: {
    fpProject: {
      loaderBg: null,
      fpImg: null,
      bgSet: function() {
        var _this = this;
        $.ajax({
          url: "colorCalc.php",
          type: "POST",
          data: {
            src: this.fpImg.attr("data-src")
          },
          success: function(rgb) {
            _this.loaderBg.css("background", rgb);
          }
        });
      },
      showImg: function() {
        if (this.fpImg.parent().hasClass("is-hidden")) {
          this.imageLoad();
        }
      },
      imageLoad: function() {
        this.fpImg.parent().removeClass("is-hidden");
        this.fpImg.parent().addClass("is-proccess");
        this.fpImg.parent().append("<span class='loadMonitor show'></span>");
        this.fpImg.load(
          this.fpImg.attr("data-src"),
          //callback
          function() {
            $(this).attr("src", $(this).attr("data-src"));
            $(this).parent().addClass("is-loaded");
            $(this).parent().find(".loadMonitor").removeClass("show");
            var $this = $(this);
            setTimeout(function() {
              $this.parent().removeClass("is-proccess");
              $this.parent().find(".loadMonitor").remove();
            }, 500);
          }
        );
      },
      init: function() {
        this.loaderBg = $(".fpProject_loader");
        this.fpImg = $(".fpProject_content img");
        this.bgSet();
        this.showImg();
      }
    },
    fpPhoto: {
      elems: null,
      events: function() {
        var _this = this;
        $(document).on("scroll", function() {
          _this.elems.each(function() {
            if (!$(this).hasClass("open")) {
              if (
                $(document).scrollTop() + 20 >
                $(this).offset().top - $(window).height()
              ) {
                _this.show($(this));
              }
            }
          });
        });
      },
      show: function(item) {
        item.closest(".fpPhoto_box").addClass("open");
      },
      init: function() {
        this.elems = $(".fpPhoto img");
        this.events();
      }
    },
    scrollAnim: {
      items: null,
      fadeUp: function(item) {
        item.addClass("animed");
      },
      checkPos: function(){
        var _this = this;
        this.items.each(function() {
          if (
            $(document).scrollTop() >
            $(this).offset().top - $(window).height()
          ) {
            _this.anim($(this));
          }
        });
      },
      events: function() {
        var _this = this;
        $(document).on("scroll", function() {
          _this.checkPos();
        });
      },
      anim: function(item) {
        if (!item.hasClass("animed")) {
          this.fadeUp(item);
        }
      },
      init: function() {
        this.items = $(".scrollanim,.scrollanimChild >*");
        this.events();
        this.checkPos();
      }
    },
    yaMapCreate: {
      create: function() {
        ymaps.ready(function() {
          var myMap = new ymaps.Map(
              "map",
              {
                center: [55.751574, 37.573856],
                zoom: 9
              },
              {
                searchControlProvider: "yandex#search"
              }
            ),
            // Создаём макет содержимого.
            MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
              '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
            ),
            myPlacemark = new ymaps.Placemark(
              myMap.getCenter(),
              {
                hintContent: "Собственный значок метки",
                balloonContent: "Это красивая метка"
              },
              {
                // Опции.
                // Необходимо указать данный тип макета.
                iconLayout: "default#image",
                // Своё изображение иконки метки.
                iconImageHref: "images/myIcon.gif",
                // Размеры метки.
                iconImageSize: [30, 42],
                // Смещение левого верхнего угла иконки относительно
                // её "ножки" (точки привязки).
                iconImageOffset: [-5, -38]
              }
            ),
            myPlacemarkWithContent = new ymaps.Placemark(
              [55.661574, 37.573856],
              {
                hintContent: "Собственный значок метки с контентом",
                balloonContent: "А эта — новогодняя",
                iconContent: "12"
              },
              {
                // Опции.
                // Необходимо указать данный тип макета.
                iconLayout: "default#imageWithContent",
                // Своё изображение иконки метки.
                iconImageHref: "images/ball.png",
                // Размеры метки.
                iconImageSize: [48, 48],
                // Смещение левого верхнего угла иконки относительно
                // её "ножки" (точки привязки).
                iconImageOffset: [-24, -24],
                // Смещение слоя с содержимым относительно слоя с картинкой.
                iconContentOffset: [15, 15],
                // Макет содержимого.
                iconContentLayout: MyIconContentLayout
              }
            );

          myMap.geoObjects.add(myPlacemark).add(myPlacemarkWithContent);
        });
      },
      init: function() {
        this.create();
      }
    },
    init: function() {
      if ($(".fpProject")) this.fpProject.init();
      if ($(".fpPhoto")) this.fpPhoto.init();
      if ($(".scrollanim,.scrollanimChild")) this.scrollAnim.init();
      if ($("#map")) this.yaMapCreate.init();
    }
  },
  init: function() {
    this.main.init();
    if ($(".projects")) this.projects.init();
    this.projectsDetail.init();
  }
};
