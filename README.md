# **jxhl**
Javascript and Xml for Html Layout,  a helpful javascript library for html layout, it's also a MV framework and can save many html/css code.
Jxhl works well with jQuery, Bootstrap and other popular front-end libraries.
It compatibles with IE7+, Chrome, Safari, Firefox, Opera and Mobile browsers on Android/iOS.

> Like Android Layout and WPF XAML, make html layouts easier. 
> *If you are an Android developer or a Windows Form/WPF developer, you can understand JXHL syntax in minutes.*


----------


## **syntax**

> Jxhl is based on xml to define a few tags to render html tags,  we name it ***jxhl control***. Every jxhl tag has some defined attributes which will render as html tag attributes or style, let us name it ***jxhl attribute***.

### Jxhl control
 - panel  -- *render as div tag, just can contain jxhl controls as children*
 - html  -- *render as div tag, and it's xml text will be append to this div as html code*
 - image -- *render* `<div><img/></div>`
 - label  -- *render* `<div>XML text in label tag</div>`
 - frame -- *render* `<div><iframe></iframe></div>`
 - runnable 

> **runnable** is a very important control that will not render as html code,  it explains to a layout scope javascript block, the runnable code will run after the xml rendered to html.
>      Each xml layout file can be used as a scope, it just can contains a runnable control, the javascript code in runnable contains 3 variables (`jxhl$container`, `jxhl$argument`, `jxhl$localVars`) and local_var variables defined in jxhl attribute.

### Jxhl attribute
>**dock** is the most important attribute to set jxhl control's position, it makes the html element display to any place you want to play.     

 - id
 - dock  -- *auto(not calc region), top, center, bottom, left, right, fill(full fill left region), fix(absolute full fill parent container, not calc region), float(not calc region, not set x,y), none(not calc region, just append to parent container)* `we usually need to use top/left/bottom/right/fill in normal html layout`
 - visible -- *1/0/true/false* 
 - width -- `integer(500 means 500px), percent(0.3* or 30% means 30% of parent container)`
 - height -- *the same with width*
 - left -- *the same with width*
 - top -- *the same with width*
 - css_name -- *html tag css attribute*
 - css_text -- html tag style attribute
 - border_width -- *if you want to define a border in style, you should define control's border width first, it is a single integer or an array with* `[↑,→,↓,←]`
 - margin -- *a single integer or an array with* `[↑,→,↓,←]`
 - opacity -- *0~1*
 - local_var -- *it will be register as a variable to runnable scope*
 - template -- *include a layout file*
 - template_args -- *it just can be one javascript object type variable, and it must be defined in runnable scope or global scope* 


## **Jxhl box model**


## **public methods**
`jxhl.getElement("jxhl id attribute",containerElement)` //get layout scope element by jxhl id attribute

`jxhl.notifyResize(containerElement)` //notify the container to adjust size and position

`jxhl.init('layout file path', containerIdOrElement, 'text or path', runnableArguments, callbackFunction);` // init a layout file, then append to container


## **layout demo**

> the following code is sample1.xml under demo folder

	<?xml version="1.0" encoding="utf-8" ?>
	<jxhl xmlns="http://halo-studio.com/jxhl" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://halo-studio.com/jxhl ../jxhl.xsd">
     <panel dock="fill" border_width="1" css_text="border-style:solid; border-color:#cccccc;" local_var="top_container">
           <panel dock="top" height="30" id="top" border_width="0,0,1,0" css_text="border-style:solid; border-color:#cccccc; background:#fcfcfc;">
               <label dock="fill" margin="1,0,0,5" css_text="line-height:28px; color:blue; font-weight:bold;">Title section</label>
        </panel>
        <panel dock="left" width="100" border_width="0,1,0,0" css_text="border-style:solid; border-color:#cccccc;background:#fcfcfc;">
            <label dock="center" width="100" height="60" margin="5">Left</label>
        </panel>
        <panel dock="bottom" height="26" css_text="background:#fcfcfc; line-height:26px; color:#999;">
            <label dock="none" margin="0,10,0,10">Bottom section</label>
        </panel>
        <panel dock="fill" border_width="0,0,1,0" css_text="border-style:solid; border-color:#cccccc;">
            <frame local_var="frame_test" dock="left" width="200" height="60" src="https://www.github.com" frame_scrolling="auto"></frame>
            <label dock="center" local_var="test_var">Center Content</label>
        </panel>
    </panel>
	<runnable>
        <![CDATA[
        var container = jxhl$container;
        var args = jxhl$arguments;
        console.log(frame_test, jxhl$container, jxhl$arguments, jxhl$localVars);
        ]]>
    </runnable>
	</jxhl>





