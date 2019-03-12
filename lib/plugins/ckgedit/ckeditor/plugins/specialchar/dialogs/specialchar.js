CKEDITOR.dialog.add("specialchar",function(f){var g,c=f.lang.specialchar;var d=function(j){var m,l;if(j.data){m=j.data.getTarget()}else{m=new CKEDITOR.dom.element(j)}if(m.getName()=="a"&&(l=m.getChild(0).getHtml())){m.removeClass("cke_light_background");g.hide();var k=f.document.createElement("span");k.setHtml(l);f.insertText(k.getText())}};var h=CKEDITOR.tools.addFunction(d);var b;var i=function(k,m){var l;m=m||k.data.getTarget();if(m.getName()=="span"){m=m.getParent()}if(m.getName()=="a"&&(l=m.getChild(0).getHtml())){if(b){a(null,b)}var j=g.getContentElement("info","htmlPreview").getElement();g.getContentElement("info","charPreview").getElement().setHtml(l);j.setHtml(CKEDITOR.tools.htmlEncode(l));m.getParent().addClass("cke_light_background");b=m}};var a=function(j,k){k=k||j.data.getTarget();if(k.getName()=="span"){k=k.getParent()}if(k.getName()=="a"){g.getContentElement("info","charPreview").getElement().setHtml("&nbsp;");g.getContentElement("info","htmlPreview").getElement().setHtml("&nbsp;");k.getParent().removeClass("cke_light_background");b=undefined}};var e=CKEDITOR.tools.addFunction(function(k){k=new CKEDITOR.dom.event(k);var j=k.getTarget();var m,l;var o=k.getKeystroke(),n=f.lang.dir=="rtl";switch(o){case 38:if((m=j.getParent().getParent().getPrevious())){l=m.getChild([j.getParent().getIndex(),0]);l.focus();a(null,j);i(null,l)}k.preventDefault();break;case 40:if((m=j.getParent().getParent().getNext())){l=m.getChild([j.getParent().getIndex(),0]);if(l&&l.type==1){l.focus();a(null,j);i(null,l)}}k.preventDefault();break;case 32:d({data:k});k.preventDefault();break;case n?37:39:if((m=j.getParent().getNext())){l=m.getChild(0);if(l.type==1){l.focus();a(null,j);i(null,l);k.preventDefault(true)}else{a(null,j)}}else{if((m=j.getParent().getParent().getNext())){l=m.getChild([0,0]);if(l&&l.type==1){l.focus();a(null,j);i(null,l);k.preventDefault(true)}else{a(null,j)}}}break;case n?39:37:if((m=j.getParent().getPrevious())){l=m.getChild(0);l.focus();a(null,j);i(null,l);k.preventDefault(true)}else{if((m=j.getParent().getParent().getPrevious())){l=m.getLast().getChild(0);l.focus();a(null,j);i(null,l);k.preventDefault(true)}else{a(null,j)}}break;default:return}});return{title:c.title,minWidth:430,minHeight:280,buttons:[CKEDITOR.dialog.cancelButton],charColumns:17,onLoad:function(){var m=this.definition.charColumns,s=f.config.specialChars;extraChars=f.config.extraSpecialChars;s=s.concat(extraChars);var k=CKEDITOR.tools.getNextId()+"_specialchar_table_label";var q=['<table role="listbox" aria-labelledby="'+k+'" style="width: 320px; height: 100%; border-collapse: separate;" align="center" cellspacing="2" cellpadding="2" border="0">'];var p=0,u=s.length,r,n;while(p<u){q.push('<tr role="presentation">');for(var o=0;o<m;o++,p++){if((r=s[p])){n="";if(r instanceof Array){n=r[1];r=r[0]}else{var t=r.replace("&","").replace(";","").replace("#","");n=c[t]||r}var l="cke_specialchar_label_"+p+"_"+CKEDITOR.tools.getNextNumber();q.push('<td class="cke_dark_background" style="cursor: default" role="presentation"><a href="javascript: void(0);" role="option" aria-posinset="'+(p+1)+'"',' aria-setsize="'+u+'"',' aria-labelledby="'+l+'"',' class="cke_specialchar" title="',CKEDITOR.tools.htmlEncode(n),'" onkeydown="CKEDITOR.tools.callFunction( '+e+', event, this )" onclick="CKEDITOR.tools.callFunction('+h+', this); return false;" tabindex="-1"><span style="margin: 0 auto;cursor: inherit">'+r+'</span><span class="cke_voice_label" id="'+l+'">'+n+"</span></a>")}else{q.push('<td class="cke_dark_background">&nbsp;')}q.push("</td>")}q.push("</tr>")}q.push("</tbody></table>",'<span id="'+k+'" class="cke_voice_label">'+c.options+"</span>");this.getContentElement("info","charContainer").getElement().setHtml(q.join(""))},contents:[{id:"info",label:f.lang.common.generalTab,title:f.lang.common.generalTab,padding:0,align:"top",elements:[{type:"hbox",align:"top",widths:["320px","90px"],children:[{type:"html",id:"charContainer",html:"",onMouseover:i,onMouseout:a,focus:function(){var j=this.getElement().getElementsByTag("a").getItem(0);setTimeout(function(){j.focus();i(null,j)},0)},onShow:function(){var j=this.getElement().getChild([0,0,0,0,0]);setTimeout(function(){j.focus();i(null,j)},0)},onLoad:function(j){g=j.sender}},{type:"hbox",align:"top",widths:["100%"],children:[{type:"vbox",align:"top",children:[{type:"html",html:"<div></div>"},{type:"html",id:"charPreview",className:"cke_dark_background",style:"border:1px solid #eeeeee;font-size:28px;height:40px;width:70px;padding-top:9px;font-family:'Microsoft Sans Serif',Arial,Helvetica,Verdana;text-align:center;",html:"<div>&nbsp;</div>"},{type:"html",id:"htmlPreview",className:"cke_dark_background",style:"border:1px solid #eeeeee;font-size:14px;height:20px;width:70px;padding-top:2px;font-family:'Microsoft Sans Serif',Arial,Helvetica,Verdana;text-align:center;",html:"<div>&nbsp;</div>"}]}]}]}]}]}});