tassembly
=========

JSON IR for templating and corresponding runtime implementation

Motto: Fast but safe!

Security guarantees of DOM-based templating (tag balancing, context-sensitive
href/src/style sanitization etc) with the performance of string-based templating.

The JSON format is compact, can easily be persisted and can be evaluated with
a tiny library.

Performance is on par with compiled handlebars templates, the fastest
string-based library in our tests.

Input examples:

```javascript
['<div',['attr',{id:'id'}],'>',['text','body'],'</div>']
['<div',['attr',{id:'id'}],'>',
      ['foreach',{data:'m_items',tpl:['<div',['attr',{id:'key'}],'>',['text','val'],'</div>']}],
'</div>']
```
