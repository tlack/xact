function xact(Scope) {
	if(!Scope) Scope={};
	Scope.SHOWASSERT=SHOWASSERT=1;
	Scope.MAXITER=MAXITER=5;
	Scope.U=U=typeof(blehhhh);

	// Values: Misc..
	Scope.copy=function copy(x) { return jd(je(x)); }
	Scope.eq=function eq(x,y) { //emit([x,y],'equal');
		if (typeof(x)!==typeof(y)) return false;
		if (Array.isArray(x) && Array.isArray(y) && x.length!=y.length) return false;
		if (typeof(x)!=='object' && x==y) return true; //simple values - hopefully
		return JSON.stringify(x)==JSON.stringify(y); }
	Scope.first=function first(x) {
		if(!tarray(x)) throw 'first(): x::array';
		return x[0]; }
	Scope.ins=function ins(x,y) {
		if(tstr(x)&&tstr(x)) { return x+y; }
		if(tstr(x)&&tarray(y)&&tstr(y[0])) { return x+over(ins,y) }/*!killme*/
		if(tarray(x)) { var r=copy(x);r.push(y);return r; }
		if(tdict(x)&&tdict(y)) { return Object.assign(x,y); }
		return [x,y]; }
	Scope.last=function last(x) {
		if(!tarray(x)) throw 'last(): x::array';
		return x[len(x)-1]; }
	Scope.len=function len(x) { 
		const tx=typeof(x);
		if(tarray(x)||tstr(x)) return x.length;
		else if (tx==='object') {
			if (x.hasOwnProperty('len')) return x.len();
			else if (x.hasOwnProperty('length')) { return x.length; }
			else return Object.keys(x).length;
		};
		throw 'len: bad arg';
	}
	Scope.max=function max(min,max) { if(tarray(min)) return Math.max.apply(null,min); else return Math.max(min,max);  }
	Scope.min=function min(mm,mx) { if(tarray(mm)) return Math.min.apply(null,mm); else return Math.min(mm,mx); }
	Scope.take=function take(x,n) {
		let st,en=n,i,R=[],xn=len(x);
		if(n<0) st=xn-n; else st=0;
		for(i=st;i<en;i++) R.push(x[i % xn]);
		return R;
	}
	// Values: Sorting..
	Scope.sort=function sort(retcodes, vals, keyOpt) {
		const tv=t(vals);
		if (tv==='array') {
			if (keyOpt) return vals.sort(function(a,b) {
					const ak=a[keyOpt], bk=b[keyOpt];
					return ak==bk ? 0 : (ak < bk ? retcodes[0] : retcodes[1]);
				});
			else return vals.sort(function(a,b) { return a==b?0:(a<b?retcodes[0]:retcodes[1]); });
		}
		throw 'sort(): not yet implemented'; }
	Scope.asc=function asc(vals, key) { return sort([-1, 1], vals, key); }
	Scope.desc=function desc(vals, key) { return sort([1, -1], vals, key); }
	// Values: Types..
	Scope.t=function t(x) { 
		if (Array.isArray(x)) return 'array';
		const t=typeof(x);
		if (x===U||t===U) return 'undef';
		if (t==='number' && Math.floor(x)==x) return 'int'; /*lame*/
		else if (t==='number') return 'float'; /*lame*/ else if (t==='function') return 'func';
		return t; /*fallthru*/ }
	Scope.tarray=function tarray(x) { return Array.isArray(x); }
	Scope.tstr=function tstr(x) { return typeof(x)==='string'; }
	Scope.tbox=function tbox(x) { return typeof(x)==='object' || Array.isArray(x); }
	Scope.tdict=function tdict(x) { return typeof(x)==='object' && !Array.isArray(x); }
	Scope.tfunc=function tfunc(x) { return typeof(x)==='function'; }
	Scope.tU=function tU(x) { return typeof(x)==='undefined'; }
	// Debugging:
	Scope._req=function _req(fs) {
		if(typeof require=='undefined') throw('_req(): cannot get '+fs);
		return require(fs); }
	Scope.assert=function assert(v,exp,msg) { if(!eq(v,exp)) { emit([v,exp],'assertion failed: '+msg); process.exit(1); } if(SHOWASSERT)emit(msg,'passed:'); return v; }
	Scope.emit=function emit(x,y){if(y!==undefined)console.log(y,': '); console.log(x);return x;}
	Scope.noemit=function noemit(x,y){return x;}
	Scope.ordie=function ordie(value, exc) { if(tU(value)) throw exc; else return value; }
	// System:
	Scope.file=function file(fn, contentsOpt) {
		var fs=_req('fs');
		if(tU(contentsOpt)) return fs.readFileSync(fn,'utf-8');
		else return fs.writeFileSync(fn,contentsOpt,'utf-8'); }
	Scope.jd=function jd(x) { return JSON.parse(x); }
	Scope.je=function je(x) { return JSON.stringify(x); }
	// More trippy stuff
	Scope.each=function(x,f) { x.forEach(f); }
	Scope.eachleft=function(x,f) {
		if(!tarray(x) || x.length != 2 || !tarray(x[0])) throw 'eachLeft(): x must be [ [1, 2, 3], 10 ]';
		const x0=x[0],x0n=x0.length,x1=x[1]; var i,R=[];
		for(i=0;i<x0n;i++) R.push(f(x0[i],x1,i));
		return R;
	}
	Scope.eachright=function(x,f) {
		if(!tarray(x) || x.length != 2 || !tarray(x[1])) throw 'eachLeft(): x must be [ 10, [1, 2, 3] ]';
		const x0=x[1],x0n=x0.length,x1=x[0]; var i,R=[];
		for(i=0;i<x0n;i++) R.push(f(x1,x0[i],i));
		return R;
	}
	Scope.eachboth=function(x,f) {
		if(!tarray(x) || x.length != 2 || !tarray(x[0]) || !tarray(x[0]) || len(x[0]) != len(x[1])) throw 'eachboth: [ [1,2,3],[10,20,30] ]';
		const xn=len(x[0]); var i=0,R=[];
		for(;i<xn;i++) R.push(f(x[0][i],x[1][i],i)); 
		return R;
	}
	Scope.over=function over(x,f,val) { // binary function f; (f..(f(f(x[0],x[1]),x[2]),x[3...]))
		if(!tarray(x)) throw 'over(): x must be array';
		if(tU(val)) val=x.shift();
		const xn=len(x); for(let i=0;i<xn;i++) val=f(val,x[i]);
		return val;
	}
	Scope.proj1=function proj1(f,x) { return function(y) { f(x,y); } }
	Scope.scan=function over(x,f,val) { // binary function f; [ f(x[0],x[1]), f(f(x[0],x[1]),x[2]), ... ]
		if(!tarray(x)) throw 'scan(): x must be array';
		if(tU(val)) val=x.shift();
		const xn=len(x); let R=[]; for(let i=0;i<xn;i++) R.push(val=f(val,x[i]));
		return R;
	}
	// "Recursive combinators"
	Scope.exhaust=function exhaust(x,f,opt) {
		var last=x,iter=0;
		while (1) { x=last; last=f(x,opt,iter); if (eq(x,last)) return last; if (iter++==MAXITER) return last; }
	}
	Scope.wide=function wide(x,f,last,path) { 
		emit(x,'wide');
		if(tU(x) || !tarray(x)) return x;
		let xl=x.length; if(xl==0) return x;
		if(last==undefined) last=x;
		if(path==undefined) path=[];
		let R=[];
		for (let i=0;i<xl;i++) {
			if(tarray(x[i])) { var p=ins(path,i); last=wide(f(x[i],p,last),f,last,p); if(!tU(last)) R.push(last); }
			else R.push(x[i]);
		}
		return R;
		//[ [ 49, 2, [ 147, 4 ] ], 8 ]
		//[ [ 7, 2, [ 21, 4 ] ], 8 ]
	}
	Scope.deep=function deep(x,f,last) { 
		if(!tarray(x)) throw 'deep(): arg not list';
		let xl=x.length; if(xl==0) return x;
		if(last==undefined) last=x;
		let R=[];
		for (let i=0;i<xl;i++) {
			if(tarray(x[i])) last=deep(x[i],f,last); else last=f(x[i],i,last);
			if(!tU(last)) R.push(last);
		}
		return R;
	}
	Scope.get=function get(x,idx) {
		//emit([x,idx],'get');
		if(tarray(idx)) { // deep indexing:
			var R=[],i;
			var last=x;
			for(i=0; i<idx.length; i++) {
				if(tfunc(last)) last=last(idx[i]);
				else last=last[idx[i]];
			}
			return last;
		} else return x[idx]; // todo funcs
	}
	Scope.match=function(x,sym) {
		if(!tarray(x)) throw 'match(): x must be [ ["$syma"],["$symb",3,4,5] ]';
		var R=[];
		function visit(x, path, last) { if(x[0]==sym) R.push(path); return x; }
		var z=wide(x, visit);
		return R;
	}
	function _nest0(L, open, close, path) {
		noemit(L,'start _nest0 '+path);
		const LL=L.length; var opens=[],R=[],i;
		if(LL==0) return L;
		R=L;
		for(i=0; i<LL; i++) {
			if(L[i]==close) { 
				if (opens.length==0) throw 'nest(): imbalanced';
				var oidx=opens.pop();
				var inner=R.slice(oidx+1, i); 
				emit(R,'presplice');
				R.splice(oidx, i-oidx+len(open)+len(close)-1, inner);
				emit(R,'recurse');
				return _nest0(R, open, close, ins(path,i));
				emit([oidx,i],'replacing');
				//emit(ins(path,i),'_nest0 path');
			} else {
				if(L[i]==open) opens.push(i);
			}
		}
		noemit(R,'_end nest0 '+path);
		return R;
	}
	Scope.nest=function nest(L, open, close) {
		if(!tarray(L)) throw('nest(): L::array');
		L=[L];
		emit(L,"nest");
		R=wide(L,function(x,path){return _nest0(x,open,close,path);});
		//return _nest0(L,open,close,0);
		return R;
	}

	Scope.selftest=function() {
		assert(asc([4,1,7]),[1,4,7],'asc0');
		assert(desc([4,1,7]),[7,4,1],'desc0');
		assert(take([1,2,3],1),[1],'take0');
		assert(take([1,2,3],0),[],'take1');
		assert(take([1,2,3],4),[1,2,3,1],'take2');
		function mul(x,y){return x*y;}
		assert(over([3,5,7],mul),105,'over0');
		assert(over([5,7],mul,3),105,'over1');
		assert(scan([3,5,7],mul),[15,105],'scan0');
		assert(scan([5,7],mul,3),[15,105],'scan1');
		assert(eachleft([ [1,2,3], 10 ],mul),[10,20,30],'el0');
		assert(eachright([ 5, [6,7,8] ],mul),[30,35,40],'er0');
		assert(eachboth([ [4,5,6],[3,4,5] ],mul),[12,20,30],'eb0');
		assert(exhaust(10, function(x) { return x <= 5 ? x : x-1; }),5,'exhaust0');
		var t=[[1,2,[3,4]],8];
		var a=deep(t,function(x){return x*2;});
		assert(last(a),16,'deep0');assert(len(a),2,'deep1');assert(a[0][2][0],6,'deep2');
		var aa=deep(t,function(x){if (x%2==0) return x*10;});
		assert(aa,[[20,[40]],80],'deep3');
		var b=wide(t,function(x){emit(x,'wide-b-x'); if (!tarray(x[0])) x[0]=x[0]*7;return x;});
		emit(b,'finalb');
		assert(last(b),8,'wide0'); assert(b[0][0],7,'wide1'); assert(b[0][2][0],21,'wide2');
		var t_sym=[ ['$name','Bob'], ['$age',30], ['$parents',['$name','Olga'],['$name','Sam']] ];
		var c=wide(t_sym,function(x){if(first(x)=='$name')x[1]=x[1].toUpperCase();return x;});
		assert(first(c)[1],'BOB','wide0sym');

		var c=wide(t_sym,function(x){emit(x,'t_sym_f'); if (x[0]=='$age') return x;});
		emit(c,'wide-c');
		assert(len(c)==1 && len(c[0])==2 && first(c)[0],'$age','wide1sym');
		var d=match(t_sym, '$name');
		var e=eachright([t_sym,d],get);
		assert(len(e),len(d),'match-er-0');
		assert(first(last(e)),'$name','match-er-1');

		o=nest("1(2)".split(''),"(",")");
		assert(len(o),1,'nest0'); assert(len(o[0]),2,'nest1'); assert(len(o[0][1]),1,'nest2');

		o=nest("(1)".split(''),"(",")");
		emit(o);
		assert(len(o),1,'nest3'); assert(len(o[0]),1,'nest4'); assert(len(o[0][0]),1,'nest5');

		o=nest("(module)".split(''),"(",")");
		emit(o);
		o2=wide(o[0],function(x){emit(x,'o2-wide'); return x.join('');});
		emit(o2);

		o=nest("(1(2)(3))".split(''),"(",")");
		each(o,emit);

		o=first(nest("(1 2)".split(''),"(",")"));
		each(o,emit);
		flatten=function(x) { return wide(x, function(x){return x.join('');}); }
		o2=flatten(o);
		emit(je(o2));
		//o3=wide(o[0],ins);
		//emit(o3);
		//o=wide(["(1 (2) (3) ) ".split('')],function(x){return nest(x.join(''),"(",")");});
		//emit(o);
		emit('all tests','passed');
	}
	return Scope;
}

if(typeof(module)!='undefined') {
	module.exports = xact; 
}
