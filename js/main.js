$(document).ready(function() {
  init_js();
});
var init_js = function() {
  templs.init();
  pages.init();
  XHRequests.init();
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
        document.addEventListener("keydown", function(e) {
          if (_this.state === "opened" && e.keyCode === 27) {
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
        this.eventsInited = true;
        var _this = this;
        $(document).scroll(function() {
          _this._doing($(this).scrollTop());
        });
      },
      _doing: function(scrollTop, firstInit) {
        if (!firstInit) firstInit = false;
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
        if (!this.eventsInited) this.events();
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
        hideElements: function(callBack) {
          var _this = this;
          for (var i = 0; i < _this.items.length; i++) {
            _this.items
              .eq(i)
              .delay(_this.basicDelay * i)
              .fadeOut(_this.basicTimeAnimate);
          }
          setTimeout(function() {
            setTimeout(function() {
              if (callBack) callBack();
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
      _removeBg: function(callback) {
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
            if (callback) callback();
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
        $(
          ".header_mobileMenu_item:not(.header_mobileMenu_search):not(.language)"
        ).click(function() {
          _this.close();
          _this.parent.srcrollFix.del();
        });
        $(window).on("resize", function() {
          if (_this.state === "opened" && $(window).width() > 1024) {
            _this.close();
            _this.parent.srcrollFix.del();
          }
        });
      },
      _elementsFadeIn: function() {
        var _this = this;
        var num2 = 0;
        var elems = $(document).find(".header_mobileMenu_item")
        var fadeInEl = setInterval(function() {
          if (num2 < elems.length) {
            elems.eq(num2).addClass("faded");
            num2++;
          } else {
            clearInterval(fadeInEl);
          }
        }, _this.basicDelay);
      },
      _elementsFadeOut: function(callback) {
        var elems = $(document).find(".header_mobileMenu_item")
        var _this = this;
        var num = elems.length - 1;
        var fadeOutEl = setInterval(function() {
          if (num >= 0) {
            elems.eq(num).removeClass("faded");
            num--;
          } else {
            if (callback) callback();
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
    dropDown: {
      events: function() {
        $(".header_menuSub").click(function() {
          if ($(window).width() <= 1024) {
            if ($(this).hasClass("active")) {
              $(this).attr("style", "");
            } else {
              $(this).height($(this).find(".header_menuSub_box").height() + 15);
            }
          }
          $(this).toggleClass("active");
        });
      },
      init: function() {
        this.events();
      }
    },
    menu: {
      events: function() {
        this.eventsInited = true;
        $(".header_logo").click(function() {
          $(".header_menu_item").removeClass("active");
        });
        $(".header_menu_item").click(function() {
          $(".header_menu_item").removeClass("active");
          $(this).addClass("active");
        });
      },
      init: function() {
        if (!this.eventsInited) this.events();
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
      this.menu.init();
      if ($(".header_menuSub")) this.dropDown.init();
    }
  },
  footer: {
    box: null,
    menus: null,
    animed: false,
    anim: function() {
      if (!this.animed) {
        this.animed = true;
        var i = 0;
        var items = $(
          ".footer_menu_wrapper,.footer_col:last-child, .footer_col:last-child .footer_title"
        );
        var intrvl = setInterval(function() {
          if (i < items.length) {
            items.eq(i).addClass("show");
            i++;
          } else {
            clearInterval(intrvl);
          }
        }, 100);
      }
    },
    checkAnim: function() {
      var _this = this;
      if ($(".footer").length > 0) {
        if (
          $(window).height() + $(document).scrollTop() >
          $(".footer").offset().top + 100
        ) {
          _this.anim();
        }
      }
    },
    events: function() {
      var _this = this;
      this.eventsInited = true;
      this.menus.click(function() {
        if ($(window).width() <= 1024) {
          if ($(this).hasClass("active")) {
            _this.close($(this));
          } else {
            _this.open($(this));
          }
        }
      });
      $(document).scroll(function() {
        _this.checkAnim();
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
      this.checkAnim();
      if (!this.eventsInited) this.events();
    }
  },
  popup: {
    basicTimeAnimate: 500,
    open: function(id) {
      $(".popup").addClass("active");
      $(".popup_item").removeClass("active");
      $(".popup_item" + id).addClass("active");
      $(".popup").animate(
        {
          opacity: 1
        },
        this.basicTimeAnimate
      );
      $(".popup_item" + id).animate(
        {
          opacity: 1
        },
        this.basicTimeAnimate
      );
      $("body").addClass("scrollDis");
    },
    close: function() {
      $(".popup,.popup_item").animate(
        {
          opacity: 0
        },
        this.basicTimeAnimate,
        function() {
          $(".popup,.popup_item").removeClass("active");
        }
      );
      $("body").removeClass("scrollDis");
      $(".fotorama-box").data("fotorama").stopVideo();
    },
    events: function() {
      var _this = this;
      $(".js-popup").click(function(e) {
        e.preventDefault();
        _this.open($(this).attr("href"));
      });
      $(".popup_close").click(function() {
        _this.close();
      });
      document.addEventListener("keydown", function(e) {
        if ($(".popup_item").hasClass("active") && e.keyCode === 27)
          _this.close();
      });
    },
    forms: {
      submits: function() {
        var _this = this;
        $(".popup_item#careers form").submit(function(e) {
          e.preventDefault();
          $(this).find("input,textarea").val("");
          $(this).find(".form_fileList .list .item").remove();
          _this.popups.open("#careers-succes");
        });
      },
      init: function() {
        this.submits();
      }
    },
    init: function() {
      this.events();
      this.forms.popups = this;
      this.forms.init();
    }
  },
  form: {
    files: [],
    uploadFiles: function(event, inputFile) {
      var _this = this;
      event.stopPropagation();
      event.preventDefault();
      var data = new FormData();
      this.files.forEach(function(item, key) {
        console.log(item, key);
        data.append(key, item.file);
        item.box
          .find(".text")
          .html("Подождите идет загрузка…")
          .parent()
          .removeClass("error");
      });
      $.ajax({
        url: "upload.php",
        type: "POST",
        data: data,
        cache: false,
        dataType: "json",
        processData: false,
        contentType: false,
        success: function(data, textStatus, jqXHR) {
          _this.files.forEach(function(item, key) {
            if (data[key].error) {
              item.box.remove();
            } else {
              $.ajax({
                type: "POST",
                url: "files.php",
                data: {
                  data: data[key]
                },
                success: function(a) {
                  if (a) {
                    var file = a.split("#")[0];
                    var size = a.split("#")[1];
                    // inputFile
                    //   .parent()
                    //   .find("label")
                    //   .html("Файл загружен <span>" + size + "</span>");

                    item.box.find(".text").html(file);
                    item.box.removeClass("loading");
                    item.box.addClass("load");
                  } else {
                    item.box.remove();
                  }
                }
              });
            }
          });
        },
        error: function(jqXHR, textStatus, errorThrown) {
          _this.files.forEach(function(item, key) {
            item.box.find(".text").html("Ошибка загрузки");
            item.box.removeClass("loading");
            item.box.addClass("error");
          });

          console.log("ERRORS: " + textStatus);
        }
      });
    },
    prepareUpload: function(event, inputFile) {
      var _this = this;
      this.files = [];
      $.each(event.target.files, function(key, value) {
        inputFile
          .parent()
          .find(".form_fileList .list")
          .append(
            '<li class="item loading"><span class="text"></span> <span class="del"></span></li>'
          );
        _this.files.push({
          id: key,
          file: value,
          box: inputFile.parent().find(".form_fileList .list li:last-child")
        });
      });
      this.uploadFiles(event);
    },
    events: function() {
      var _this = this;
      $("input[type=file]").change(function(event) {
        var inputFile = $(this);
        _this.prepareUpload(event, inputFile);
      });
      $(".form_fileList .list .item .del").click(function() {
        var num = $(this).parent().index();
        $(".form_box [type=file]")[0].files;
      });
    },
    init: function() {
      this.events();
    }
  },
  gallery: {
    setImgs: function() {
      $('[href="#photorama"]').find(".data-imgs input").each(function() {
        var item = '<a href="' + this.value + '"></a>';
        $(".popup_item#photorama .fotorama-box").append(item);
      });
    },
    fotoramaInit: function() {
      var tsize = 145;
      if ($(window).width() <= 1024) {
        tsize = 80;
      }
      var fotorama = $(".fotorama-box").fotorama({
        width: $(window).width(),
        maxwidth: "100%",
        height: $(window).height() - ($(window).width() > 768 ? 90 : 110),
        allowfullscreen: false,
        nav: "thumbs",
        transition: "crossfade",
        trackpad: false,
        swipe: $(window).width() < 768,
        fit: "contain",
        thumbwidth: tsize,
        thumbheight: tsize,
        arrows: false,
        click: false
      });
    },
    events: function() {
      var _this = this;
      var del = 120;
      var tDelta = 0;
      var moved = false;
      function onWheel(e) {
        if (
          $("#photorama:hover").length > 0 &&
          !($(".fotorama__loaded--img.zoomed:hover").length > 0)
        ) {
          var slider = $(".fotorama-box").data("fotorama");
          e = e || window.event;
          var delta = e.deltaY || e.detail || e.wheelDelta;
          tDelta += delta;
          if ($("#photorama").hasClass("active") && !moved) {
            if (tDelta > del) {
              tDelta = 0;
              if (slider.activeIndex < slider.size - 1)
                slider.show(slider.activeIndex + 1);
              moved = true;
              setTimeout(function() {
                moved = false;
              }, 300);
            } else if (tDelta < -del) {
              tDelta = 0;
              if (slider.activeIndex > 0) slider.show(slider.activeIndex - 1);
              moved = true;
              setTimeout(function() {
                moved = false;
              }, 300);
            }
          }
        }
      }
      if (document.addEventListener) {
        if ("onwheel" in document) {
          document.addEventListener("wheel", onWheel, { passive: false });
        } else if ("onmousewheel" in document) {
          document.addEventListener("mousewheel", onWheel, { passive: false });
        } else {
          document.addEventListener("MozMousePixelScroll", onWheel, {
            passive: false
          });
        }
      } else {
        document.attachEvent("onmousewheel", onWheel);
      }

      $(document).on("fotorama:show", ".fotorama-box", function(a, slider) {
        $(document)
          .find(".mobile_nav")
          .find(".count")
          .text(slider.activeIndex + 1 + " / " + slider.size);
        $(".fotorama__loaded--img").removeClass("zoomed");
        $(".fotorama__stage").removeClass("zoomed");
        grabbed = false;
        zommed = false;
        down = false;
      });
      $(document).on("click", ".mobile_nav .left", function() {
        var slider = $(".fotorama-box").data("fotorama");
        if (slider.activeIndex > 0) slider.show(slider.activeIndex - 1);
      });
      $(document).on("click", ".mobile_nav .right", function() {
        var slider = $(".fotorama-box").data("fotorama");
        if (slider.activeIndex < slider.size)
          slider.show(slider.activeIndex + 1);
      });
      $('a[href="#photorama"]').click(function() {
        $(".popup_item#photorama .popup_full").html(
          '<div class="fotorama-box" ></div><div class="mobile_nav"><div class="str left"></div><div class="count">1 / 9</div> <div class="str right"></div></div>'
        );
        $(this).find(".data-imgs input").each(function() {
          var poster = "";
          if ($(this).attr("poster")) {
            poster = '<img src="' + $(this).attr("poster") + '"/>';
          }
          var item = '<a href="' + this.value + '">' + poster + "</a>";
          $(".popup_item#photorama .fotorama-box").append(item);
        });
        _this.fotoramaInit();
      });

      ///////zoooooooommmmmmm
      var grabbed = false;
      var zommed = false;
      var down = false;
      var smove = 0;
      var pos = { x: 0, y: 0 };
      $(
        document
      ).on(
        "click",
        ".fotorama__loaded--img:not(.fotorama__stage__frame--video)",
        function(e) {
          if (!grabbed && $(this).hasClass("zoomed")) {
            $(this).removeClass("zoomed");
            $(".fotorama__stage").removeClass("zoomed");
            zommed = false;
          } else {
            zommed = true;
            $(this).addClass("zoomed");
            $(".fotorama__stage").addClass("zoomed");
          }
        }
      );
      $(document).on("mousedown", ".fotorama__loaded--img", function(e) {
        pos.x = e.pageX;
        pos.y = e.pageY;
        down = true;
      });
      $(document).on("mousemove", ".fotorama__loaded--img", function(e) {
        if (down && zommed) {
          if (smove > 5) {
            grabbed = true;
          } else {
            smove += Math.abs(e.pageX - pos.x) + Math.abs(e.pageY - pos.y);
          }
          if (grabbed) {
            $(this).scrollTop($(this).scrollTop() + pos.y - e.pageY);
            $(this).scrollLeft($(this).scrollLeft() + pos.x - e.pageX);
          }
          pos.x = e.pageX;
          pos.y = e.pageY;
        }
      });
      $(document).on("mouseleave", ".fotorama__loaded--img", function(у) {
        setTimeout(function() {
          grabbed = false;
        }, 100);
        down = false;
      });
      $(document).on("mouseup", ".fotorama__loaded--img", function(у) {
        setTimeout(function() {
          grabbed = false;
        }, 100);
        down = false;
        smove = 0;
      });
    },
    init: function() {
      this.setImgs();
      this.fotoramaInit();
      this.events();
    }
  },
  body: {
    scroll: function() {
      //$(".wrapper").perfectScrollbar({ suppressScrollX: true });
      //$('.wrapper').css('height','100vh')
    },
    events: function() {
      var cutTop = $(document).scrollTop();
      $(document).on("scroll", function(e) {
        if ($("body").hasClass("scrollDis")) {
          e.preventDefault();
          $(document).scrollTop(cutTop);
        } else {
          cutTop = $(document).scrollTop();
        }
      });
    },
    init: function() {
      this.scroll();
      this.events();
    }
  },
  init: function() {
    this.header.init();
    this.footer.init();
    this.popup.init();
    this.form.init();
    this.gallery.init();
    this.body.init();
  }
};
var pages = {
  main: {
    slider: {
      boxClass: "fpSlider",
      labelsClass: "fpSlider_labels",
      bgs: null,
      texts: null,
      videos: null,
      setVideos: function() {
        this.videos = $("." + this.boxClass).find("video");
      },
      startCurrentVideo: function(type) {
        var _this = this;
        if (this.videos.length > 0) {
          let i = 0;
          this.videos.each(function() {
            if (type == "init") {
              this.pause();
              if (i == 0) {
                this.load();
                this.oncanplay = function() {
                  this.play();
                };
              }
            }
            if (type == "start") {
              this.oncanplay = null;
              this.pause();
              if (i == _this.bgs.activeIndex) {
                this.load();
              }
            }
            if (type == "end") {
              if (i == _this.bgs.activeIndex) {
                console.log(this.readyState);
                if (this.readyState == 4) {
                  this.play();
                } else {
                  this.oncanplay = function() {
                    this.play();
                  };
                }
              }
            }
            i++;
          });
        }
      },
      sliderCreate: function() {
        if ($("." + this.boxClass).length > 0) {
          this.bgs = new Swiper("." + this.boxClass, {
            loop: true,
            autoplay: {
              delay: 9500,
              disableOnInteraction: false
            },
            speed: 1300,
            /* lazy: {
              loadPrevNext: true,
              loadOnTransitionStart: true
            }, */
            init: false,
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
          var _this = this;

          this.bgs.on("init", function() {
            _this.startCurrentVideo("init");
          });
          this.bgs.on("slideChangeTransitionStart", function() {
            _this.startCurrentVideo("start");
          });
          this.bgs.on("slideChangeTransitionEnd", function() {
            _this.startCurrentVideo("end");
          });
          slideVideoDo = function() {
            _this.startCurrentVideo();
          };

          this.bgs.init();
        }
      },
      init: function() {
        this.videos = $("." + this.boxClass).find("video");
        this.sliderCreate();
        this.setVideos();
      }
    },
    sound: {
      audioMuted: true,
      inProcess: false,
      loaded: false,
      muteInit: function() {
        var _this = this;
        $(".fpSlider_mute").click(function() {
          if (!_this.inProcess) {
            $(this).toggleClass("active");
            _this.audioMuted = $(".fpSlider_mute").hasClass("active");
            if (_this.audioMuted) {
              $(this).text($(this).attr("data-word-on"));
              _this.lazySart();
            } else {
              $(this).text($(this).attr("data-word-off"));
              _this.lazyStop();
            }
          }
        });
      },
      lazySart: function() {
        var _this = this;
        this.inProcess = true;
        var audio = $("audio").eq(0)[0];
        audio.volume = 0;
        var play = function() {
          audio.play();
          _this.loaded = true;
          var intrvl = setInterval(function() {
            audio.volume += 0.01;
            if (audio.volume >= 0.9) {
              clearInterval(intrvl);
              audio.volume = 1;
              _this.inProcess = false;
            }
          }, 10);
        };
        if (!this.loaded) {
          audio.load();
          audio.oncanplay = play;
        } else {
          play();
        }
      },
      lazyStop: function() {
        var _this = this;
        this.inProcess = true;
        var audio = $("audio").eq(0)[0];

        var intrvl = setInterval(function() {
          audio.volume -= 0.01;
          if (audio.volume <= 0.1) {
            clearInterval(intrvl);
            audio.pause();
            audio.volume = 0;
            _this.inProcess = false;
          }
        }, 10);
      },
      init: function() {
        this.muteInit();
        $("audio").eq(0)[0].load();
      }
    },
    init: function() {
      if ($(window).width() <= 650) {
        $(".fpSlider").find("video").remove();
      }
      this.slider.init();
      if ($("audio").length > 0) this.sound.init();
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
      var stack = 0;
      this.items.each(function() {
        var $this = $(this);
        if (
          $(document).scrollTop() + $(window).height() >
          $(this).offset().top
        ) {
          if ($(window).width() > 768) {
            if (!_this.intrvl[y]) {
              stack++;
              _this.intrvl[y] = setTimeout(function() {
                if ($this.hasClass("is-hidden")) {
                  _this.imageLoad($this);
                }
              }, _this.index * _this.basicDelay);
            }
            if ($this.hasClass("is-hidden") && stack == 2) {
              stack = 0;
              _this.index++;
            }
          } else {
            if (!_this.intrvl[y]) {
              stack++;
              _this.intrvl[y] = setTimeout(function() {
                if ($this.hasClass("is-hidden")) {
                  _this.imageLoad($this);
                }
              }, _this.index * _this.basicDelay);
            }
            if ($this.hasClass("is-hidden") && stack == 1) {
              stack = 0;
              _this.index++;
            }
          }
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
      this.eventsInited = true;
      $(document).on("scroll", function() {
        _this.showImg();
      });
    },
    init: function() {
      this.items = $(document).find(".projects_item");
      this.intrvl = [];
      this.index = 0;
      this.bgSet();
      if (!this.eventsInited) this.events();
      this.showImg();
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
      checkPos: function() {
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
        this.items = $(document).find(".scrollanim,.scrollanimChild >*");
        this.events();
        this.checkPos();
      }
    },
    adaptiveslider: {
      item: null,
      width: 600,
      create: function() {
        if ($(window).width() <= this.width) {
          this.item.slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            speed: 1000,
            infinite: false,
            dots: true,
            arrows: false
          });
        }
      },
      events: function() {
        var _this = this;
        $(window).on("resize", function() {
          _this.create();
        });
        _this.create();
      },
      init: function() {
        this.item = $(".sItems_list");
        this.events();
      }
    },
    infSlider: {
      box: null,
      buts: null,
      bar: null,
      animate: false,
      create: function() {
        this.box.slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          speed: 600,
          infinite: false,
          dots: false,
          arrows: false
        });
        var i = 0;
        this.buts.each(function() {
          $(this).attr("slide-id", i), i++;
        });
      },
      moveBar: function(ofsetLeft, width) {
        this.bar.css("left", ofsetLeft);
        this.bar.css("width", width + 40);
      },
      events: function() {
        var _this = this;
        this.buts.click(function() {
          if (!$(this).hasClass("active") && !_this.animate) {
            _this.buts.removeClass("active");
            $(".infSlider_select").removeClass("active");
            $(this).addClass("active");
            _this.animate = true;
            _this.box.slick("slickGoTo", $(this).attr("slide-id"));
            _this.moveBar(
              $(this).offset().left - $(this).parent().offset().left,
              $(this).width()
            );
          } else if ($(window).width() <= 768) {
            if (!$(".infSlider_select").hasClass("active")) {
              $(".infSlider_select").addClass("active");
              var scroll = $(document).scrollTop();
              $(document).scrollTop(scroll + 1);
              $(document).scrollTop(scroll);
            } else {
              $(".infSlider_select").removeClass("active");
            }
          }
        });
        $(window).on("resize", function() {
          var item = $(".infSlider_menu_item.active");
          _this.moveBar(
            item.offset().left - item.parent().offset().left,
            item.width()
          );
        });
        this.box.on("afterChange", function() {
          _this.animate = false;
        });
        this.moveBar(0, _this.buts.eq(0).width());
      },
      init: function() {
        this.box = $(".infSlider_list");
        this.buts = $(".infSlider_menu_item");
        this.bar = $(".infSlider_bar");
        this.create();
        this.events();
      }
    },
    btnBack: {
      but: null,
      events: function() {
        this.but.click(function(e) {
          e.preventDefault();
          history.back();
        });
      },
      init: function() {
        this.but = $("#back_page");
        this.events();
      }
    },
    yaMapCreate: {
      center: [55.751574, 37.573856],
      createPlaceMark: function(coords, src, sity, name, link) {
        var width = 400;
        if ($(window).width() <= 600) width = 320;
        return new ymaps.Placemark(
          coords,
          {
            balloonContentHeader:
              '<div class="yaMap_head">' +
              '<img src="' +
              src +
              '" class="" height="174" width="' +
              width +
              '"/>' +
              "</div>",
            // Зададим содержимое основной части балуна.
            balloonContentBody:
              '<div class="yaMap_content">' +
              "<p>" +
              sity +
              "</p>" +
              "<h3>" +
              name +
              "</h3>" +
              '<a href="' +
              link +
              '" class="default-btn btn-gray">Перейти к проекту<a>' +
              "</div>",

            balloonContentFooter: "",
            hintContent: name
          },
          {
            hideIconOnBalloonOpen: false,
            iconLayout: "default#image",
            iconImageHref: "images/loc.svg",
            iconImageSize: [60, 60],
            iconImageOffset: [-30, -30]
          }
        );
      },
      create: function() {
        var _this = this;
        ymaps.ready(function() {
          var myMap = new ymaps.Map(
            "map",
            {
              center: _this.center,
              zoom: 16,
              type: "yandex#satellite",
              controls: []
            },
            {
              searchControlProvider: "yandex#search"
            }
          );
          myPlacemark = _this.createPlaceMark(
            [55.751574, 37.573856],
            "images/projects/proj_1.jpg",
            "Санкт-Петербург",
            "Мультиформатный жилой комплекс «Golden City»",
            "#"
          );
          myMap.events.add("click", function() {
            myMap.balloon.close();
          });
          myMap.behaviors.disable("scrollZoom");
          if ($(".map_data .placeMark").length) {
            $(".map_data .placeMark").each(function() {
              myMap.geoObjects.add(
                _this.createPlaceMark(
                  $(this).attr("data-cords").split(","),
                  "images/projects/proj_1.jpg",
                  $(this).attr("data-sity"),
                  $(this).attr("data-name"),
                  $(this).attr("data-link")
                )
              );
            });
          }
        });
      },
      create_full: function() {
        var _this = this;
        ymaps.ready(function() {
          var myMap = new ymaps.Map(
              "map",
              {
                center: _this.center,
                zoom: 6,
                controls: []
              },
              {
                searchControlProvider: "yandex#search"
              }
            ),
            myPlacemark = _this.createPlaceMark(
              [55.751574, 37.573856],
              "images/projects/proj_1.jpg",
              "Санкт-Петербург",
              "Мультиформатный жилой комплекс «Golden City»",
              "#"
            );
          myMap.events.add("click", function() {
            myMap.balloon.close();
          });
          myMap.behaviors.disable("scrollZoom");
          myMap.geoObjects.add(myPlacemark);
        });
      },
      init: function() {
        if ($("#map").hasClass("full")) {
          this.create_full();
        } else {
          this.create();
        }
      }
    },
    init: function() {
      if ($(".fpProject").length > 0) this.fpProject.init();
      if ($(".fpPhoto").length > 0) this.fpPhoto.init();
      if ($(".scrollanim,.scrollanimChild").length > 0) this.scrollAnim.init();
      if ($("#map").length > 0) this.yaMapCreate.init();
      if ($(".sItems").length > 0) this.adaptiveslider.init();
      if ($(".infSlider").length > 0) this.infSlider.init();
      if ($("#back_page").length > 0) this.btnBack.init();
    }
  },
  servicesDetail: {
    slider: null,
    create: function() {
      this.slider.slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        speed: 1200,
        cssEase: "ease-in-out",
        infinite: false,
        dots: true,
        arrows: false,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1
            }
          }
        ]
      });
    },
    init: function() {
      this.slider = $(".bItems_list.slider");
      this.create();
    }
  },
  company: {
    dropDown: function(item) {
      if ($(window).width() <= 950) {
        if (item.hasClass("open")) {
          item.attr("style", "");
          item.removeClass("open");
        } else {
          item.addClass("open");
          item.height(item.find(".inner").height() + 40);
        }
      }
    },
    dropDownVacancy: function(item) {
      if (item.hasClass("open")) {
        item.height(
          item.find(".vacancy_title").height() +
            item.find(".vacancy_title").css("padding-top").replace("px", "") * 2
        );
        item.removeClass("open");
      } else {
        item.addClass("open");
        item.height(item.find(".vacancy_item_inner").height() + 30);
      }
    },
    setVacancy: function(item) {
      item.height(
        item.find(".vacancy_title").height() +
          item.find(".vacancy_title").css("padding-top").replace("px", "") * 2
      );
    },
    dropDownPrize: function(item) {
      if ($(window).width() <= 600) {
        if (item.hasClass("open")) {
          item.height(item.attr("data-height"));
          item.removeClass("open");
        } else {
          if (!item.attr("data-height")) {
            item.attr("data-height", item.height());
            item.find(".prizes_text,.prizes_img").addClass("pos");
            item.height(item.attr("data-height"));
          }
          item.addClass("open");
          item.height(item.find(".prizes_item").height() + 40);
        }
      }
    },
    events: function() {
      var _this = this;
      $(".rowBox_row").click(function() {
        _this.dropDown($(this));
      });
      $(".prizes_item_wrapper").click(function() {
        _this.dropDownPrize($(this));
      });
      $(".vacancy_item").click(function() {
        _this.dropDownVacancy($(this));
      });
      if ($(".vacancy_item").length > 0)
        $(".vacancy_item").each(function() {
          _this.setVacancy($(this));
        });
    },
    init: function() {
      this.events();
    }
  },
  contacts: {
    validate: function() {
      $("#contacts_form").parsley();
    },
    init: function() {
      if ($("#contacts_form")) {
        this.validate();
      }
    }
  },
  newDetail: {
    events: function() {
      $(".boxHide_but").click(function(e) {
        e.preventDefault();
        $(this).parent().toggleClass("active");
      });
    },
    sliderInit: function() {
      $(".new_list.slider").slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        speed: 1200,
        cssEase: "ease-in-out",
        infinite: false,
        dots: true,
        arrows: false,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1
            }
          },
          {
            breakpoint: 2000,
            settings: {
              slidesToShow: 2
            }
          }
        ]
      });
    },
    validate: function() {
      $("#comment_form").parsley();
    },
    init: function() {
      this.events();
      if ($(".new_list.slider")) {
        //this.sliderInit();
      }
      if ($("#comment_form")) {
        this.validate();
      }
    }
  },
  init: function() {
    this.main.init();
    if ($(".projects")) this.projects.init();
    this.projectsDetail.init();
    this.servicesDetail.init();
    this.company.init();
    this.contacts.init();
    this.newDetail.init();
  }
};
var XHRequests = {
  store: [],
  currentPage_id: 0,
  offsetPage: 0,
  preloader: false,
  newRequest: function(href, succes, failed) {
    this.showPreloader();
    this.preloader = true;
    

    if (window.XMLHttpRequest) {
      // firefox etc
      this.XHR = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      // ie
      this.XHR = new ActiveXObject("Microsoft.XMLHTTP");
    }
    var _this = this;
    //this.XHR.responseType = "document";
    this.XHR.onload = function() {
      handleResponse(_this.XHR);
    };
    this.XHR.open("POST", href, true);

    function handleResponse(request) {
      setTimeout(function() {
        if (request.status == 200) {
          succes();
          var html = request.response;
          _this.reloadPageDoing(html);
          _this.hidePreloader();
        } else {
          failed();
        }
      }, 500);
    }

    this.XHR.onerror = function() {
      failed();
    };
    this.XHR.send();
  },
  newPage: function(href, target, e) {
    succes = function() {
      if (this.offsetPage < 0) {
        this.store.splice(
          this.currentPage_id + 1,
          this.store.length - 1 - this.currentPage_id
        );
      }
      var lastStore = this.store[this.store.length - 1];
      var next_id = lastStore ? lastStore.id + 1 : 0;
      var pageInf = {
        id: next_id,
        href: href
      };
      this.store.push(pageInf);
      history.pushState(pageInf, null, href);
      this.currentPage_id = next_id;
      $("body,html").animate(
        {
          scrollTop: 0
        },
        1000
      );
    }.bind(this);
    failed = function() {
      target.attr("data-fail-xhr", "fail");
      target[0].click();
    }.bind(this);
    this.newRequest(href, succes, failed);
  },
  backPage: function(href) {
    this.currentPage_id--;
    this.offsetPage--;
    succes = function() {}.bind(this);
    failed = function() {}.bind(this);

    this.newRequest(href, succes, failed);
  },
  nextPage: function(href) {
    this.currentPage_id++;
    this.offsetPage++;
    succes = function() {}.bind(this);
    failed = function() {}.bind(this);
    this.newRequest(href, succes, failed);
  },
  events: function() {
    var _this = this;
    $(document).on("click", ".wrapper a", function(e) {
      var href = $(this).attr("href");
      if (
        href[0] != "#" &&
        href.indexOf("tel:") != 0 &&
        href.indexOf("mailto:") != 0 &&
        href.indexOf("callto:") != 0 &&
        href != ""
      ) {
        if ($(this).attr("data-fail-xhr") == undefined) {
          e.preventDefault();
          _this.newPage(href, $(this), e);
        }
      }
    });
    window.addEventListener("popstate", function(e) {
      if (e.state) {
        if (e.state.id < _this.currentPage_id) {
          _this.backPage(e.state.href);
        } else if (e.state.id > _this.currentPage_id) {
          _this.nextPage(e.state.href);
        }
      }
    });
  },
  pullState: function() {
    if (history.length == 2) {
      href = document.location.href;
      var pageInf = {
        id: 0,
        href: href
      };
      this.store.push(pageInf);
      history.replaceState(pageInf, null, href);
    } else {
      for (var i = 0; i < history.length - 1; i++) {
        this.store.push({
          id: i,
          url: null
        });
      }
    }
  },
  showPreloader: function() {
    var _this = this;
    var loader =
      '<div class="bgLoadPage color"><div class="loadMonitor"></div></div>';
    var color = $(".header").hasClass("scrolled") ? "white" : "black";
    loader = loader.replace("color", color);
    $(".wrapper").append(loader);
    $(".wrapper").find(".bgLoadPage").animate({
      opacity: 1
    }, 500, function() {
      _this.preloader = false;
    });
  },
  hidePreloader: function() {
    var _this = this;
    func = function() {
      $(".wrapper").find(".bgLoadPage").addClass("loaded");
      setTimeout(function() {
        $(".wrapper").find(".bgLoadPage").animate({
          opacity: 0
        }, 500, function() {
          $(".wrapper").find(".bgLoadPage").remove();
        });
      }, 300);
    };
    if (_this.preloader) {
      var wait = setInterval(function() {
        if (!_this.preloader) {
          func();
          clearInterval(wait);
        }
      }, 50);
    } else func();
  },
  reloadPageDoing: function(html) {
    $(".wrapper .page").html($(html).find(".wrapper .page > *"));
    if ($(html).find(".wrapper.only-fp").length > 0) {
      $(".wrapper").addClass("only-fp");
    } else {
      $(".wrapper").removeClass("only-fp");
    }
    /////////
    $("head").find('*:not(link[rel="stylesheet"])').remove();
    $("head").append($(html).find('head >*:not(link[rel="stylesheet"])'));
    /////////
    if (
      $(html).find(".header").hasClass("scrolled") &&
      $(html).find(".header").hasClass("scrolled-ever")
    ) {
      $(".header").addClass("scrolled-ever").addClass("scrolled");
    } else {
      $(".header").removeClass("scrolled-ever").removeClass("scrolled");
    }
    /////////
    if ($(html).find(".header_search_wrapper").hasClass("open")) {
      $(".header_search_wrapper").addClass("open");
    } else {
      $(".header_search_wrapper").removeClass("open");
    }
    /////////
    if ($(html).find(".header").hasClass("searchOpen")) {
      $(".header").addClass("searchOpen");
    } else {
      $(".header").removeClass("searchOpen");
    }
    /////////
    if ($(html).find(".header").hasClass("searchPage")) {
      $(".header").addClass("searchPage");
    } else {
      $(".header").removeClass("searchPage");
    }
    /////////
    if ($(html).find(".footer").length == 0) {
      $(".wrapper .footer").remove();
    } else if ($(".wrapper .footer").length == 0) {
      $(".wrapper").append($(html).find(".footer"));
    }
    /////////
    if ($(".wrapper .header_menuSub").length == 0) {
      $(".wrapper .header").append("<div class='header_menuSub hide'></div>");
    }
    $(".wrapper .header_menuSub >*").remove();
    if ($(html).find(".wrapper .header_menuSub >*").length > 0) {
      $(".wrapper .header_menuSub").removeClass("hide");
      $(".wrapper .header_menuSub").append(
        $(html).find(".wrapper .header_menuSub >*")
      );
    } else {
      $(".wrapper .header_menuSub").addClass("hide");
    }
    /////////
    templs.init();
    pages.init();

    $("body").removeClass("scrollDis");
  },
  init: function() {
    this.XHR = new XMLHttpRequest();
    this.pullState();
    this.events();
    this.hidePreloader();
  }
};
