let x=require('./xact');
o={};
x(o);
o.selftest();
if(typeof(module)!='undefined') module.exports=999;

