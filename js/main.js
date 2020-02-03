if (!inited) {
  var inited = false;
  var init_js = null;
  var templs = null;
  var pages = null;
  var XHRequests = null;
  var scrollToHash = 0;
  if (!myMap) var myMap;
  else {
    myMap.destroy();
  }
  if (!myMapFull) var myMapFull;
  else {
    myMapFull.destroy();
  }

  $(document).ready(function() {
    ymaps.ready(function() {
      init_js();
      setWindowHeight();
      console.log("inited all");
      inited = true;
    });
    if (window.location.hash.length > 0) {
      window.hashName = window.location.hash;
      scrollToHash = $(window.hashName).offset().top - $(window).height() / 2 - $(window.hashName).height()/2;
    }else{
      scrollToHash = 0;
    }
    console.log(scrollToHash)
    //document.scrollTop = scrollToHash;
   // $(document).scrollTop(scrollToHash)
  });
}
var debug = false;
var stopped = false;
var testing = false;
var setWindowHeight = function() {
  var vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", vh + "px");
};
$(window).on("load", function() {
  $('html,body').animate({
    scrollTop:scrollToHash,
  },1000)
});
$(window).on("resize", function() {
  setWindowHeight();
});
init_js = function() {
  templs.init();
  pages.init();
  XHRequests.init();
};
templs = {
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
      searchBut: null,
      backgroundPage: "<div class='header_bg bg_search'></div>",
      basicTimeAnimate: 600,
      mobileSearchBut: null,
      _appendBg: function() {
        var _this = this;
        $(document)
          .find(".header")
          .append(this.backgroundPage);
        var bg = $(document)
          .find(".header")
          .find(".header_bg.bg_search");
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
        var bg = $(document)
          .find(".header")
          .find(".header_bg.bg_search");
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
        $(document)
          .find(".header")
          .eq(0)
          .toggleClass("searchOpen");
        $(document)
          .find(".header_search_input")
          .eq(0)
          .focus();
        $(document)
          .find(".header_search_wrapper")
          .eq(0)
          .toggleClass("open");
        var _this = this;
        setTimeout(function() {
          _this._appendBg();
        }, this.basicTimeAnimate - 50);
      },
      close: function() {
        this.parent.srcrollFix.del();
        var _this = this;
        this.animate = true;
        $(document)
          .find(".header_search_wrapper")
          .removeClass("open");
        this._removeBg(function() {
          $(document)
            .find(".header_mobileMenu")
            .animate({ opacity: 1 });
          $(document)
            .find(".header")
            .toggleClass("searchOpen");
        });
      },
      events: function() {
        var _this = this;
        if (!inited) {
          $(document).on("click", ".header_search_but", function(e) {
            e.preventDefault();
            console.log("click btn");
            console.log(_this);
            if (!_this.animate) {
              if (_this.state === "closed") _this.open();
              else if (_this.state === "opened") {
                _this.close();
              }
            }
          });
          $(document).on("click", ".header_mobileMenu_search", function(e) {
            console.log("click");
            console.log(_this);
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
          $(document).on("click", ".header_mobile_search", function(e) {
            if ($(window).width() <= 1024) {
              e.preventDefault();
              if (!_this.animate) {
                if (_this.state === "opened") {
                  if (
                    $(document)
                      .find(".header_mobileMenu")
                      .hasClass("open")
                  )
                    _this.close();
                }
              }
            }
          });
          $(document).on("click", ".header_search_input_close", function(e) {
            e.preventDefault();
            if (_this.state === "opened") {
              _this.close();
            }
          });
        }
        document.addEventListener("keydown", function(e) {
          if (_this.state === "opened" && e.keyCode === 27) {
            _this.close();
          }
        });
      },
      init: function() {
        this.state = "closed";
        this.animate = false;
        this.closeBut = $(document).find(".header_search_input_close");
        this.searchBut = $(document).find(".header_search_but");
        if (!inited) this.events();
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
          if (!inited) this.events();
        }
      },
      _appendBg: function() {
        var _this = this;
        $(document)
          .find(".header")
          .find(".header_bg")
          .remove();
        $(document)
          .find(".header")
          .append(this.backgroundPage);
        var bg = $(document)
          .find(".header")
          .find(".header_bg.bg_burger");
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
        var bg = $(document)
          .find(".header")
          .find(".header_bg.bg_burger");
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
        click = function(e) {
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
        };
        if (!inited)
          $(document).on("click", ".header_mobile_burger", function(e) {
            click(e);
          });
        $(document)
          .find(
            ".header_mobileMenu_item:not(.header_mobileMenu_search):not(.language)"
          )
          .unbind("click");
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
        var elems = $(document).find(".header_mobileMenu_item");
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
        var elems = $(document).find(".header_mobileMenu_item");
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
        $(document)
          .find(".header")
          .addClass("burgerOpen");
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
        console.log
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
            $(document)
              .find(".header")
              .removeClass("burgerOpen");
          }
        );
      },
      init: function() {
        this.but = null;

        this.menu = null;
        this.menu = $(".header_mobileMenu");
        this.language.init();
        $(document)
          .find(".header_mobile_burger")
          .off();
        this.events();
        this.animate = false;
        this.state = 'closed';
        this.close();
      }
    },
    dropDown: {
      events: function() {
        $(document).on("click", ".header_menuSub", function() {
          if ($(window).width() <= 1024) {
            if ($(this).hasClass("active")) {
              $(this).attr("style", "");
            } else {
              $(this).height(
                $(this)
                  .find(".header_menuSub_box")
                  .height() + 15
              );
            }
          }
          $(this).toggleClass("active");
        });
      },
      init: function() {
        if (!inited) this.events();
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
        var items = $(document).find(
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
      if ($(document).find(".footer").length > 0) {
        if (
          $(window).height() + $(document).scrollTop() >
          $(document)
            .find(".footer")
            .offset().top +
            100
        ) {
          _this.anim();
        }
      }
    },
    events: function() {
      var _this = this;
      if(!inited)
      $(document).on("click", ".footer_menu_wrapper", function() {
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
      this.animed = false;
      this.box = $(".footer");
      this.checkAnim();
      this.events();
    }
  },
  popup: {
    basicTimeAnimate: 500,
    open: function(id, addClass) {
      $(".popup").addClass("active");
      if (addClass) $(".popup").addClass(addClass);
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
          $(".popup").removeClass("inWindow");
        }
      );
      $("body").removeClass("scrollDis");
      $(".fotorama-box")
        .data("fotorama")
        .stopVideo();
    },
    events: function() {
      var _this = this;
      $(".js-popup").click(function(e) {
        e.preventDefault();
        _this.open($(this).attr("href"));
      });
      $(".popup_close,.close_but").click(function(e) {
        e.preventDefault();
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
          $(this)
            .find("input,textarea")
            .val("");
          $(this)
            .find(".form_fileList .list .item")
            .remove();
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
      var succesTextLoad = inputFile.attr("succesTextLoad");
      var errorTextLoad = inputFile.attr("errorTextLoad");
      var proccesTextLoad = inputFile.attr("proccesTextLoad");
      this.files.forEach(function(item, key) {
        var data_ = new FormData();
        data_.append(key, item.file);
        item.box
          .find(".text")
          .html(proccesTextLoad)
          .parent()
          .removeClass("error");
        $.ajax({
          url: "/local/templates/main/ajax_file_upload/upload.php",
          type: "POST",
          data: data_,
          cache: false,
          processData: false,
          contentType: false,
          success: function(a, textStatus, jqXHR) {
            console.log(a);
            if (a.error_text) {
              item.box.remove();
            } else {
              $.ajax({
                type: "POST",
                url: "/local/templates/main/ajax_file_upload/files.php",
                data: {
                  data: a
                },
                success: function(a) {
                  console.log(a);
                  if (a) {
                    var file = a.split("#")[0];
                    var size = a.split("#")[1];
                    item.box
                      .find(".text")
                      .html(
                        succesTextLoad +
                          " <span>" +
                          file.replace("/upload/", "") +
                          " " +
                          size +
                          "</span>"
                      );
                    item.box.removeClass("loading");
                    item.box.append(
                      '<input style="display:none" type="file" name="file_' +
                        key +
                        '" value="' +
                        file +
                        '"/>'
                    );
                    item.box.addClass("load");
                  } else {
                    item.box.find(".text").html(errorTextLoad);
                    item.box.removeClass("loading");
                    item.box.addClass("error");
                  }
                },
                error: function(a, textError, c) {
                  console.log(textError);
                }
              });
            }
          },
          error: function(jqXHR, textStatus, errorThrown, aa) {
            _this.files.forEach(function(item, key) {
              item.box.find(".text").html("Ошибка загрузки");
              item.box.removeClass("loading");
              item.box.addClass("error");
            });
            console.log("ERRORS: " + textStatus);
          }
        });
      });
      inputFile.val("");
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
      this.uploadFiles(event, inputFile);
    },
    events: function() {
      var _this = this;
      $("input[type=file]").change(function(event) {
        _this.prepareUpload(event, $(this));
        $(".form_fileList .list").html();
      });
      $(document).on("click", ".form_fileList .list .item .del", function() {
        var num = $(this)
          .parent()
          .remove();
      });
    },
    init: function() {
      this.events();
    }
  },
  gallery: {
    setImgs: function() {
      $('[href="#photorama"]')
        .find(".data-imgs input")
        .each(function() {
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
        maxwidth: "200%",
        height: $(window).height() - ($(window).width() > 768 ? 90 : 110),
        allowfullscreen: false,
        nav: "thumbs",
        loop: true,
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
      if (navigator.userAgent.search(/Firefox/) > 0) {
        del = 3;
      }
      if (navigator.userAgent.search(/Chrome/) > 0) {
        del = 100;
      }
      if (navigator.userAgent.search(/YaBrowser/) > 0) {
        del = 100;
      }
      var tDelta = 0;
      var moved = false;
      function onWheel(e) {
        e = e || window.event;
        if (
          $("#photorama").hasClass("active") &&
          !($(".fotorama__loaded--img.zoomed:hover").length > 0)
        ) {
          var slider = $(".fotorama-box").data("fotorama");
          var delta = e.deltaY || e.detail || e.wheelDelta;
          tDelta += delta;
          if (delta > 0) {
            if (tDelta < 0) tDelta = 0;
            tDelta += delta;
          }
          if (delta < 0) {
            if (tDelta > 0) tDelta = 0;
            tDelta += delta;
          }
          console.log(tDelta, delta);
          if ($("#photorama").hasClass("active") && !moved) {
            if (tDelta >= del) {
              tDelta = 0;
              slider.show(">");
              moved = true;
              setTimeout(function() {
                moved = false;
              }, 300);
            } else if (tDelta < -del) {
              tDelta = 0;
              slider.show("<");
              moved = true;
              setTimeout(function() {
                moved = false;
              }, 300);
            }
          }
        }
        if (
          $(document)
            .find("#photorama")
            .hasClass("active")
        ) {
          e.preventDefault();
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
        $(document)
          .find(".fotorama__stage__frame")
          .css("opacity", 0);
        $(".fotorama__loaded--img.fotorama__active").removeClass("auto-width");
        if ($(".fotorama__loaded--img.fotorama__active img").length > 0)
          if (
            $(".fotorama__loaded--img.fotorama__active img")[0].naturalWidth <
            parseInt($(".fotorama__loaded--img.fotorama__active").width())
          ) {
            $(".fotorama__loaded--img.fotorama__active").addClass("auto-width");
          }
        grabbed = false;
        zommed = false;
        down = false;
      });
      $(document).on("fotorama:load", ".fotorama-box", function(a, slider) {
        $(".fotorama__loaded--img.fotorama__active").removeClass("auto-width");
        if ($(".fotorama__loaded--img.fotorama__active img").length > 0)
          if (
            $(".fotorama__loaded--img.fotorama__active img")[0].naturalWidth <
            parseInt($(".fotorama__loaded--img.fotorama__active").width())
          ) {
            $(".fotorama__loaded--img.fotorama__active").addClass("auto-width");
          }
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
      $(document).on("click", 'a[href="#photorama"]', function() {
        $(".popup_item#photorama .popup_full").html(
          '<div class="fotorama-box" ></div><div class="mobile_nav"><div class="str left"></div><div class="count">1 / 9</div> <div class="str right"></div></div>'
        );
        $(this)
          .find(".data-imgs input")
          .each(function() {
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
      $(document).on(
        "click",
        ".fotorama__loaded--img:not(.fotorama__stage__frame--video)",
        function(e) {
          if (!grabbed && $(this).hasClass("zoomed")) {
            $(this).removeClass("zoomed");

            $(this)
              .find("img")
              .css("min-width", "auto");
            $(this)
              .find("img")
              .css("min-height", "auto");
            $(".fotorama__stage").removeClass("zoomed");
            zommed = false;
          } else if (!$(this).hasClass("auto-width")) {
            zommed = true;
            var img = $(this)
              .find("img")
              .eq(0)[0];
            img.style.cssText +=
              "min-width:" + img.naturalWidth + "px !important;";
            img.style.cssText +=
              "min-height:" + img.naturalHeight + "px !important;";
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

            pos.x = e.pageX;
            pos.y = e.pageY;
          }
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
      if (!inited) this.events();
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
  errorMess: {
    offsetWords: 20,
    copyText: function() {
      var div = document.createElement("div");
      div.appendChild(
        window
          .getSelection()
          .getRangeAt(0)
          .cloneContents()
      );
      var selectionText = div.innerText.replace(new RegExp("\\r?\\n", "g"), "");

      var allTextInBlock = window.getSelection().anchorNode.parentElement;
      var allTextInBlockText = allTextInBlock.innerText;
      posLeft = 0;
      var pos = allTextInBlockText.indexOf(selectionText);
      function findstr() {
        allTextInBlock = allTextInBlock.parentElement;
        allTextInBlockText = allTextInBlock.innerText;
        pos = allTextInBlockText.indexOf(selectionText);
      }
      //findstr();
      if (pos > this.offsetWords) {
        posLeft = pos - this.offsetWords;
      }
      posRight = pos + selectionText.length;

      var leftText = allTextInBlockText.substr(posLeft, pos - posLeft);
      var rightText = allTextInBlockText.substr(posRight, this.offsetWords);

      $("#messError .popup_textError").html(
        leftText + "<span>" + selectionText + "</span>" + rightText
      );
      var url = document.location.href;
      $("#messError")
        .find("[name=error]")
        .val(selectionText);
      $("#messError")
        .find("[name=place]")
        .val(allTextInBlockText);
      $("#messError")
        .find("[name=url]")
        .val(url);
    },
    popupOpen: function() {
      this.copyText();
      this.parent.popup.open("#messError", "inWindow");
    },
    messing: function() {
      var _this = this;
      //отправка и последующее открытие окна с информацией
      $(document).on("submit", "#messError form", function(e) {
        e.preventDefault();
        _this.parent.popup.open("#messError_succes", "inWindow");
      });
    },
    events: function() {
      var _this = this;
      var ctrlPress = false;
      $(window).keydown(function(event) {
        if (event.keyCode == 17 || event.keyCode == 91) {
          ctrlPress = true;
        }
      });
      $(window).keyup(function(event) {
        if (event.keyCode == 17 || event.keyCode == 91) {
          ctrlPress = false;
        }
      });
      $(window).keydown(function(event) {
        if (event.keyCode == 13 && ctrlPress) {
          _this.popupOpen();
        }
      });
    },
    init: function() {
      this.events();
      this.messing();
    }
  },
  init: function() {
    this.errorMess.parent = this;
    this.header.init();
    this.footer.init();
    this.popup.init();
    this.form.init();
    this.gallery.init();
    this.body.init();
    this.errorMess.init();
  }
};
pages = {
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
          var i = 0;
          this.videos.each(function() {
            if (type == "init") {
              if (i == 0) {
                this.src = $(this).attr("data-src");
                this.autoplay = true;
              }
            }
            if (type == "start") {
              if (i == _this.bgs.activeIndex) {
                this.src = $(this).attr("data-src");
                this.autoplay = false;
              }
            }
            if (type == "end") {
              if (i == _this.bgs.activeIndex) {
                this.autoplay = true;
                this.play();
              } else {
                this.src = "";
                this.oncanplay = null;
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
            speed: 1300,
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
        $("audio")
          .eq(0)[0]
          .load();
      }
    },
    init: function() {
      if ($(window).width() <= 650 || $(window).width() <= 950 && $(window).height() <= 450) {
        $(".fpSlider")
          .find("video")
          .remove();
          $(".fpSlider_wrapper")
          .find("audio")
          .remove();
      } else {
        $(".fpSlider_wrapper")
          .find("audio").eq(0).attr('src',$(".fpSlider_wrapper")
          .find("audio").eq(0).attr('data-src'))
        // $(".fpSlider")
        //   .find("video")
        //   .each(function() {
        //     $(this).attr("src", $(this).attr("data-src"));
        //   });
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
      if ($this.find(".projects_item_img").attr("data-src")) {
        $this.find(".projects_item_img").on("load", function() {
          $this.addClass("is-loaded");
          $this.find(".loadMonitor").removeClass("show");
          setTimeout(function() {
            $this.removeClass("is-proccess");
            $this.find(".loadMonitor").remove();
          }, 500);
        });
        $this
          .find(".projects_item_img")
          .attr("src", $this.find(".projects_item_img").attr("data-src"));
      }
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
            $(this)
              .parent()
              .addClass("is-loaded");
            $(this)
              .parent()
              .find(".loadMonitor")
              .removeClass("show");
            var $this = $(this);
            setTimeout(function() {
              $this.parent().removeClass("is-proccess");
              $this
                .parent()
                .find(".loadMonitor")
                .remove();
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
        $(document).on("click", ".fpPhoto_box", function() {
          $(this)
            .parent()
            .find(".js-popup")
            .click();
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
              $(this).offset().left -
                $(this)
                  .parent()
                  .offset().left,
              $(this).width()
            );
          } else if ($(window).width() <= 768) {
            if (!$(".infSlider_select").hasClass("active")) {
              $(".infSlider_select").addClass("active");
              /* var scroll = $(document).scrollTop();
              $(document).scrollTop(scroll + 1);
              $(document).scrollTop(scroll); */
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
        this.moveBar(
          _this.buts.eq(0).offset().left -
            _this.buts
              .eq(0)
              .parent()
              .offset().left,
          _this.buts.eq(0).width()
        );
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
        // this.but.click(function(e) {
        //   e.preventDefault();
        //   history.back();
        // });
      },
      init: function() {
        this.but = $("#back_page");
        this.events();
      }
    },
    yaMapCreate: {
      center: null,
      createPlaceMark: function(coords, src, sity, name, link) {
        var width = 400;
        if ($(window).width() <= 600) width = 320;
        console.log(coords, src, sity, name, link);
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
            iconImageHref: "/local/templates/main/images/loc.svg",
            iconImageSize: [40, 40],
            iconImageOffset: [-20, -20]
          }
        );
      },
      create: function() {
        var _this = this;
        myMap = new ymaps.Map(
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
        myMap.events.add("click", function() {
          myMap.balloon.close();
        });
        myMap.behaviors.disable("scrollZoom");
        if ($(".map_data .placeMark").length > 0) {
          $(".map_data .placeMark").each(function() {
            myMap.geoObjects.add(
              _this.createPlaceMark(
                $(this)
                  .attr("data-cords")
                  .split(","),
                $(this).attr("data-img"),
                $(this).attr("data-sity"),
                $(this).attr("data-name"),
                $(this).attr("data-link")
              )
            );
          });
        }
        var zoomControl = new ymaps.control.ZoomControl({
          options: {
            size: "auto",
            float: "none",
            position: { right: 10, bottom: 40 }
          }
        });
        if ($("#map").hasClass("hasBalloon"))
          myMap.geoObjects.options.set({ hasBalloon: false });
        if ($(window).width() < 768) {
          myMap.behaviors.disable("drag");
        }
        myMap.controls.add(zoomControl);
      },
      create_full: function() {
        var _this = this;
        var zoom = $("#map").hasClass("hasBalloon") ? 13 : 6;

        myMapFull = new ymaps.Map(
          "map",
          {
            center: _this.center,
            zoom: zoom,
            controls: []
          },
          {
            searchControlProvider: "yandex#search"
          }
        );
        clusterer = new ymaps.Clusterer({
          preset: "islands#invertedVioletClusterIcons",
          clusterIcons: [
            {
              href: "/local/templates/main/images/map_claster.svg",
              size: [50, 50],
              offset: [-25, -25]
            }
          ],
          groupByCoordinates: false,
          clusterIconColor: "black",
          clusterDisableClickZoom: true,
          clusterHideIconOnBalloonOpen: false,
          geoObjectHideIconOnBalloonOpen: false
        });
        clusterer.options.set({
          gridSize: 80,
          clusterDisableClickZoom: false
        });
        myMapFull.events.add("click", function() {
          myMapFull.balloon.close();
        });
        myMapFull.behaviors.disable("scrollZoom");
        if ($(".map_data .placeMark").length > 0) {
          $(".map_data .placeMark").each(function() {
            clusterer.add(
              _this.createPlaceMark(
                $(this)
                  .attr("data-cords")
                  .split(","),
                $(this).attr("data-img"),
                $(this).attr("data-sity"),
                $(this).attr("data-name"),
                $(this).attr("data-link")
              )
            );
          });
        }
        myMapFull.geoObjects.add(clusterer);
        var zoomControl = new ymaps.control.ZoomControl({
          options: {
            size: "auto",
            float: "none",
            position: { right: 10, bottom: 40 }
          }
        });
        if ($("#map").hasClass("hasBalloon"))
          myMapFull.geoObjects.options.set({ hasBalloon: false });
        if ($(window).width() < 768) {
          myMapFull.behaviors.disable("drag");
        }
        myMapFull.controls.add(zoomControl);
      },
      init: function() {
        console.log("map_init");
        var _this = this;
        this.center =
          $(".map_data .placeMark").length > 0
            ? $(".map_data .placeMark")
                .eq(0)
                .attr("data-cords")
                .split(",")
            : [55.751574, 37.573856];
        function initMap() {
          console.log("map_ready");
          if ($("#map").hasClass("full")) {
            _this.create_full();
          } else {
            _this.create();
          }
        }
        ymaps.ready(function() {
          initMap();
        });
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
            item
              .find(".vacancy_title")
              .css("padding-top")
              .replace("px", "") *
              2
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
          item
            .find(".vacancy_title")
            .css("padding-top")
            .replace("px", "") *
            2
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
      var _this = this;
      $(".boxHide_but").click(function(e) {
        e.preventDefault();
        $(this)
          .parent()
          .toggleClass("active");
      });
      $(document).on("click", ".comment_item > .default-btn", function(e) {
        e.preventDefault();
        if (
          $(this)
            .parent()
            .find(">.form").length == 0
        ) {
          $(".comment")
            .find(".parsley-required")
            .remove();
          $(".comment")
            .find("*")
            .removeClass("parsley-error");
          var answerId = $(this)
            .parent()
            .attr("data-answer-id");
          $(".comment")
            .find(".form")
            .find('[name="abswer_id"]')
            .remove();
          $(".comment")
            .find(".form")
            .append(
              '<input name="abswer_id" type="hidden" value="' + answerId + '"/>'
            );
          var html = $(".comment")
            .find(".form")
            .eq(0)[0].outerHTML;
          $(".comment")
            .find(".form")
            .remove();
          $(html).css("margin-bottom", 0);
          $(this)[0].outerHTML = $(this)[0].outerHTML + html;
          _this.validate();

          if ($(".comment").find(".simpleCommentBut").length == 0) {
            $(".comment_title:last-child").html(
              '<a href="" class="default-btn btn-gray simpleCommentBut">Оставить коментарий</a>'
            );
          }
        }
      });
      $(document).on("click", ".simpleCommentBut", function(e) {
        e.preventDefault();
        $(".comment_title:last-child").html("Оставить коментарий");
        $(".comment")
          .find(".parsley-required")
          .remove();
        $(".comment")
          .find("*")
          .removeClass("parsley-error");
        var html = $(".comment")
          .find(".form")
          .eq(0)[0].outerHTML;
        $(".comment")
          .find(".form")
          .remove();
        $(html).attr("style", "");
        $(".comment_title:last-child").eq(0)[0].outerHTML =
          $(".comment_title:last-child").eq(0)[0].outerHTML + html;
        _this.validate();
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
XHRequests = {
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
      if (debug) {
        console.log(request);
        if (stopped) {
          return true;
        }
      }
      setTimeout(function() {
        var elem_ = document.getElementsByClassName("iframeDoc");
        if (elem_.length > 1) {
          elem_[1].parentNode.removeChild(elem_[1]);
        }

        if (request.status == 200 || request.status == 404) {
          succes();
          var temp_html = request.response;
          _this.reloadPageDoing(temp_html);

          _this.XHR.onload = null;
        } else {
          failed();
        }
      }, 500);
    }

    this.XHR.onerror = function(e) {
      if (debug) {
        console.log(e);
        if (stopped) {
          return true;
        }
      }
      failed();
      _this.XHR.onerror = null;
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
    }.bind(this);
    failed = function() {
      console.log("failed__________new-page");
      target.attr("data-fail-xhr", "fail");
      target[0].click();
    }.bind(this);
    this.newRequest(href, succes, failed);
  },
  backPage: function(href) {
    this.currentPage_id--;
    this.offsetPage--;
    succes = function() {
      console.log("succes");
    }.bind(this);
    failed = function() {
      console.log("failed");
    }.bind(this);

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
        href != "" &&
        !$(this).is("[download]") &&
        (!$(this).attr("target") || $(this).attr("target") != "_blank")
      ) {
        if ($(this).attr("data-fail-xhr") == undefined) {
          e.preventDefault();
          _this.newPage(href, $(this), e);
          if ($(this).hasClass("header_mobileMenu_lang_title")) {
            templs.header.burger.close();
          }
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
    $(".wrapper")
      .find(".bgLoadPage")
      .animate(
        {
          opacity: 1
        },
        500,
        function() {
          _this.preloader = false;
        }
      );
  },
  hidePreloader: function() {
    var _this = this;
    func = function() {
      $(".wrapper")
        .find(".bgLoadPage")
        .addClass("loaded");
      setTimeout(function() {
        $(".wrapper")
          .find(".bgLoadPage")
          .animate(
            {
              opacity: 0
            },
            500,
            function() {
              $(".wrapper")
                .find(".bgLoadPage")
                .remove();
            }
          );
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
  subDocument: function(string) {
    var _iframe = document.createElement("iframe");
    _iframe.style.display = "none";
    _iframe.className = "iframeDoc";
    document.body.appendChild(_iframe);
    var head = string.slice(
      string.indexOf("<head>") + 6,
      string.indexOf("</head>")
    );
    var body = string.slice(
      string.indexOf("<body>") + 6,
      string.indexOf("</body>")
    );
    _iframe.contentDocument.body.innerHTML = body;
    _iframe.contentDocument.head.innerHTML = head;
    return _iframe;
  },
  reloadPageDoing: function(temp_html) {
    var _this = this;
    var iframe = this.subDocument(temp_html);
    var __html = this.subDocument(temp_html).contentDocument;
    var loadedIframe = function(_html) {
      console.log("reload ________");
      var replaceDOM = function(_class, _parent) {
        var _old = document.getElementsByClassName(_class)[0];
        var _new = _html.getElementsByClassName(_class)[0];
        if (!_old) {
          _parent.append(_new);
        } else {
          _parent.replaceChild(_new, _old);
        }
      };
      var wrapper = document.getElementsByClassName("wrapper")[0];
      var newWrapper = _html.getElementsByClassName("wrapper")[0];
      replaceDOM("page", wrapper);
      replaceDOM("header", wrapper);
      replaceDOM("footer", wrapper);
      if (!0) {
        function getArray(selector, parent) {
          return Array.prototype.slice.call(parent.querySelectorAll(selector));
        }
        getArray('title,meta,[type="image/png"]', document.head).forEach(
          function(elem) {
            if (elem.remove) elem.remove();
          }
        );
        getArray("*", _html.head).forEach(function(elem) {
          var find = false;
          getArray("*", document.head).forEach(function(elem2) {
            if (elem2.outerHTML == elem.outerHTML) find = true;
          });
          if (!find && elem.tagName) document.head.appendChild(elem);
        });
      } else {
        document.documentElement.replaceChild(_html.head, document.head);
      }
      // getArray("*", document.head).forEach(function(elem, key) {
      //   var find = false;
      //   getArray("*", document.head).forEach(function(elem2, key2) {
      //     if (key != key2) {
      //       if (elem2.outerHTML == elem.outerHTML) {
      //         find = true;
      //       }
      //     }
      //   });
      //   if (find) {
      //     elem.remove();
      //   }
      // });

      wrapper.classList.remove("only-fp");
      if (newWrapper.classList.contains("only-fp"))
        wrapper.classList.add("only-fp");
      /* for (var i = 0; i < newWrapper.classList.length; i++) {
        wrapper.classList.add(newWrapper.classList[i]);
      } */
      if (window.location.hash.length > 0) {
        window.hashName = window.location.hash;
        scrollToHash = $(window.hashName).offset().top - $(window).height() / 2 - $(window.hashName).height()/2;
      }else{
        scrollToHash = 0;
      }
      function doo() {
        templs.init();
        pages.init();
        console.log("scripts inited");
        _this.hidePreloader();
        $(document).scrollTop(scrollToHash)
      }
      if (document.readyState === "complete") {
        doo();
      } else {
        window.onload = function() {
          ymaps.ready(function() {
            doo();
          });
          window.onload = null;
        };
      }
      $("body").removeClass("scrollDis");
    };

    if (iframe.contentWindow.document.readyState == "complete") {
      loadedIframe(__html);
    } else {
      iframe.onload = function() {
        loadedIframe(__html);
      };
    }
  },
  init: function() {
    this.XHR = new XMLHttpRequest();
    this.pullState();
    this.events();
    console.log("XHR inited");
    //if (!inited) this.hidePreloader();
  }
};
$(document).on("submit", "#comment_form ", function(e) {
  e.preventDefault();

  $.ajax({
    url: $("#comment_form").attr("action"),
    type: "POST", //метод отправки
    dataType: "html", //формат данных
    data: $("#comment_form").serialize(),
    success: function(data) {
      //Данные отправлены успешно
      console.log(data);
      templs.popup.open("#comment_succes", "inWindow");
    },
    error: function(response) {
      alert("Ошибка данных");
    }
  });
});
$(window).on('load',function(){
    XHRequests.hidePreloader();
})
if (document.readyState === "complete") {
  XHRequests.hidePreloader();
} else {
  window.onload = function() {
    ymaps.ready(function() {
      XHRequests.hidePreloader();
    });
    window.onload = null;
  };
}
