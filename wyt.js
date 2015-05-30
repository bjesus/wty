Answers = new Mongo.Collection("answers");

if (Meteor.isClient) {


  moment.defineLocale('he', {
        months : 'ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר'.split('_'),
        monthsShort : 'ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳'.split('_'),
        weekdays : 'ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת'.split('_'),
        weekdaysShort : 'א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳'.split('_'),
        weekdaysMin : 'א_ב_ג_ד_ה_ו_ש'.split('_'),
        longDateFormat : {
            LT : 'HH:mm',
            LTS : 'LT:ss',
            L : 'DD/MM/YYYY',
            LL : 'D [ב]MMMM YYYY',
            LLL : 'D [ב]MMMM YYYY LT',
            LLLL : 'dddd, D [ב]MMMM YYYY LT',
            l : 'D/M/YYYY',
            ll : 'D MMM YYYY',
            lll : 'D MMM YYYY LT',
            llll : 'ddd, D MMM YYYY LT'
        },
        calendar : {
            sameDay : '[היום ב־]LT',
            nextDay : '[מחר ב־]LT',
            nextWeek : 'dddd [בשעה] LT',
            lastDay : '[אתמול ב־]LT',
            lastWeek : '[ביום] dddd [האחרון בשעה] LT',
            sameElse : 'L'
        },
        relativeTime : {
            future : 'בעוד %s',
            past : 'לפני %s',
            s : 'מספר שניות',
            m : 'דקה',
            mm : '%d דקות',
            h : 'שעה',
            hh : function (number) {
                if (number === 2) {
                    return 'שעתיים';
                }
                return number + ' שעות';
            },
            d : 'יום',
            dd : function (number) {
                if (number === 2) {
                    return 'יומיים';
                }
                return number + ' ימים';
            },
            M : 'חודש',
            MM : function (number) {
                if (number === 2) {
                    return 'חודשיים';
                }
                return number + ' חודשים';
            },
            y : 'שנה',
            yy : function (number) {
                if (number === 2) {
                    return 'שנתיים';
                } else if (number % 10 === 0 && number !== 10) {
                    return number + ' שנה';
                }
                return number + ' שנים';
            }
        }
    });

   mo.setLocale('he');



  // counter starts at 0
  Session.setDefault('counter', 0);

  Router.route('/', function () {
    this.render('home');
  });

  Router.route('/admin', function () {
    this.render('answers_list');
  });

  Router.route('/tv', function () {
    this.render('tv');
  });

  Answers.after.insert(function (userId, doc) {
    $('.item.active').removeClass('active');
    $('.item:first').addClass('active');
    $("#carousel").carousel("pause").removeData();
    $("#carousel").carousel({
      interval: 5000,
      pause: 'false'
    });    
  });

  Answers.after.update(function (userId, doc) {
    $('.item.active').removeClass('active');
    $('.item:first').addClass('active');
    $("#carousel").carousel("pause").removeData();
    $("#carousel").carousel({
      interval: 5000,
      pause: 'false'
    });    
  });

  Answers.after.remove(function (userId, doc) {
    $('.item.active').removeClass('active');
    $('.item:first').addClass('active');
    $("#carousel").carousel("pause").removeData();
    $("#carousel").carousel({
      interval: 5000,
      pause: 'false'
    });    
  });

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.helpers({
    answers: function () {
      return Answers.find({approved: true});
    }
  });

  Template.answers_list.helpers({
    answers: function () {
      return Answers.find({});
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });

  Template.answers_list.events({
    "click .toggle-checked": function (e) {
      var text = $(e.target).parents('tr').find('input[type=text]').val();
      Answers.update(this._id, {$set: {approved: !this.approved, text: text}});
    },

    "keypress input.answer-edit": function (e) {
      // Set the checked property to the opposite of its current value
      //console.log(e)
      if (e.which === 13) {
        var text = $(e.target).val();
        Answers.update(this._id, {$set: {text: text, approved: true}});
      }
    }
  });

  Template.answer.rendered = function() {
    $('.item.active').removeClass('active');
    $('.item:first').addClass('active');
    $("#carousel").carousel("pause").removeData();
    $("#carousel").carousel({
      interval: 5000,
      pause: 'false'
    });
  };   

  Template.comment.events({
    'click button': function () {
      var text = $('textarea').val();
      var question = $('select').val();

      if ( (question) &&  (text)) {
        Answers.insert({
          text: text,
          approved: false,
          createdAt: new Date()
        });

        $('#add-comment').hide();
        $('#thanks').show('slow');
      } else {
        alert("יש לבחור שאלה ולהזין תשובה לפני השליחה");
      }

    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
