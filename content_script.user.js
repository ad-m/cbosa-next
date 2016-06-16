// ==UserScript==
// @name        cbosa
// @namespace   cbosa
// @include     http://orzeczenia.nsa.gov.pl/doc/*
// @version     1
// ==/UserScript==
(function () {
  if(window.location.href.indexOf("breakpoint1") > -1) {
   alert("your url contains the name breakpoint1");
  }

  // Search function
function $$(selector, context){
  return Array.prototype.slice.call( ( context || document ).querySelectorAll(selector) || [] );
}

function $1(selector, context){
  return ( context || document ).querySelector(selector);
}
  // Create DOM function
  var el = function(tag, attributes, content){
    var el = document.createElement(tag);
    if(attributes){
      Object.getOwnPropertyNames(attributes)
        .forEach(t => el.setAttribute(t, attributes[t]));
    }
    if(content){
      content.forEach(t => el.appendChild(t));
    }
    return el;
  };
  el.txt = function(txt){
    return document.createTextNode(txt);
  }; 

  const month_lang = [
    'stycznia',
    'lutego',
    'marca',
    'kwietnia',
    'maja',
    'czerwca',
    'lipca',
    'sierpnia',
    'września',
    'października',
    'listopada',
    'grudnia'
  ];

  function parseTitle(title){
    //II SAB/Kr 8/14 - Wyrok WSA w Krakowie z 2014-03-21
    var title = document.title.split(' - ');
    var sygn = title[0];
    var word = title[1].split(' ');
    var name = word.slice(0, word.length - 2).join(' ');
    var name = name.charAt(0).toLowerCase() + name.slice(1);
    var [year, month, day] = word[word.length - 1].split('-');
    var current_month = month_lang[month - 1];
    return {
      sygn: sygn,
      word: word,
      name: name,
      date: { year: parseInt(year), month: parseInt(month), day: parseInt(day)},
      month_txt: current_month
    };
  }

  var title_obj = parseTitle(document.title);

  // Set right page title
  document.title = `${title_obj.sygn} - ${title_obj.name} z dnia ${title_obj.date.day} ${title_obj.month_txt} ${title_obj.date.year} roku`;

  var name = `${title_obj.name} z dnia ${title_obj.date.day} ${title_obj.month_txt} ${title_obj.date.year} roku w sprawie sygn. akt. ${title_obj.sygn}`;

  var war_header= $1('span.war_header');
  war_header.textContent = name;

  //orzeczenie nieprawomocne => czerwony kolor
  function isCurrentLegitimate(){
    return !($1('tr.niezaznaczona:nth-child(1) > td:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)')
      .textContent
      .indexOf('nieprawomocne') > -1);
  }

  function getBench(){
    var row = $$('.info-list > tbody > tr')
        .filter(t => $$('.lista-label', t).length > 0 )
        .filter(t => $1('.lista-label', t).textContent.indexOf('dziowie') > -1)[0];
    return $1('.info-list-value', row).textContent;
  }
  function insertToolbar(text, legitimacy, kaminska, jaskowska){
    legitimacy_true = 'background-color: #00d800; color: rgb(255, 255, 255); padding: 0px 2px;';
    legimiacy_false = 'background-color: #ff363d; color: rgb(255, 255, 255); padding: 0px 2px;';
    var toolbar= el(
        'div',
        {
          'style': 'position: fixed; left: 0; top: 0; width: 100%;'
        },
        [
          el(
            'div',
            {'style': 'box-sizing: border-box; padding: 0px 5px 0px 0px; background: #C0C0C0;  width: 950px; max-width: 100%; margin: 0 auto;'},
            [
              el(
                'input',
                {
                  'type': 'text',
                  'style': 'width: 70%; margin-left: 10px; background-color: #C0C0C0; color: rgb(0, 0, 0); border-style: none;',
                  'value': text
                }
              ),
              el(
                'span',
                {
                  'style': (legitimacy ? legitimacy_true : legimiacy_false)
                },
                [legitimacy ? el.txt("orzeczenie prawomocne") : el.txt("orzeczenie nieprawomocne")]
              ),
              el(
                'span',
                {
                  'style': 'display:' + (kaminska ? 'inline': 'none')
                },
                [el.txt("K")]
              ),
              el(
                'span',
                {
                  'style': 'display:' + (jaskowska ? 'inline': 'none'),
                },
                [el.txt("J")]
              ),
              el('a', {'href': '#'}, [el.txt("[top]")])
            ]
          )
        ]
      );
    document.body.appendChild(toolbar);
    return toolbar;
  }

  var legitmate = isCurrentLegitimate();
  var bench = getBench();

  insertToolbar(name, legitmate, bench.indexOf('Kamińska') > -1, bench.indexOf('Jaśkowska') > -1);

  function addLinks(text){
    return text.replace('l OSK', 'I OSK')
      .replace(/<span class=\"highlight\">(.+?)<\/span>/g, '$1')
      .replace(/[, ](([IV]* )*(FSK|(SA|SAB)\/(Wr|Wa|Lu|Go|Kr|Rz|Gl|Sz|Po|Op)|O(SK|PS|PK)|G(SK|PS)) ([0-9]+\/[0-9]+))/g, function (match, contents, offset, s) {
      return ' <a href=\'http://orzeczenia.nsa.gov.pl/cbo/find?q=SYGNATURA+[' + encodeURIComponent(contents) + ']\'>' + contents + '</a>';
    });
  }

  function styleParagraph(paragraph) {
    paragraph.style['text-align'] = 'justify';
  };
  $$('.info-list-value-uzasadnienie').forEach(function (item) {
    item.innerHTML = addLinks(item.innerHTML);
    item.style['text-indent'] = '25px';
    $$('p', item).forEach(styleParagraph);
  });

  // Update content width
  $1('.tab').style.width = '95%';
  $1('.tab').style.margin = '0 auto';
  $1('.tab').style.paddingTop = '25px';
  $1('.tal').style.width = '960px';
  $1('.tal').style.maxWidth = '100%';

  if(window.location.href.indexOf("breakpoint2") > -1) {
   alert("your url contains the name breakpoint2");
  }
})();
