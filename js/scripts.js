$(document).on("submit", "#lab_form", function(e) {
    e.preventDefault();
  
    $.ajax({
      url: $("#lab_form").attr("action"),
      type: "POST", //метод отправки
      dataType: "html", //формат данных
      data: $("#lab_form").serialize(),
      success: function(data) {
        //Данные отправлены успешно
        templs.popup.open("#form_succes", "inWindow");
      },
      error: function(response) {
        alert("Ошибка данных");
      }
    });
  });
  
  $(document).on("submit", "#contacts_form", function(e) {
    e.preventDefault();
  
    $.ajax({
      url: $("#contacts_form").attr("action"),
      type: "POST", //метод отправки
      dataType: "html", //формат данных
      data: $("#contacts_form").serialize(),
      success: function(data) {
        //Данные отправлены успешно
        templs.popup.open("#form_succes", "inWindow");
      },
      error: function(response) {
        alert("Ошибка данных");
      }
    });
  });

  $(document).on("submit", "#error_form", function(e) {
    e.preventDefault();
  
    $.ajax({
      url: $("#error_form").attr("action"),
      type: "POST", //метод отправки
      dataType: "html", //формат данных
      data: $("#error_form").serialize(),
      success: function(data) {
        //Данные отправлены успешно
      },
      error: function(response) {
        alert("Ошибка данных");
      }
    });
  });
  