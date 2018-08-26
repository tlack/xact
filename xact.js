// TODO use better array intrinsics
function xact(Scope) {
	if(!Scope) Scope=this;
	Scope.SHOWASSERT=SHOWASSERT=1;
	Scope.MAXITER=MAXITER=5;
	Scope.U=U=typeof(blehhhh);

	// Values: Make one..
	function make(x, newtype) {
		if(!tstr(newtype)) throw 'make(): newtype::str'; // TODO declarative expects
		if(newtype[0]=='$') return [newtype,x];
		throw 'make(): nyi';
	}
	Scope.make=make;

	// Values: Misc..
	function amend(x,L,V) {
		if(!tarray(L)) { L=[L]; if (!tfunc(V)) V=[V]; }
		var i;
		if(tfunc(V)) for(i=0;i<L.length;i++) x[L[i]]=V(x[L[i]],i);
		else         for(i=0;i<L.length;i++) x[L[i]]=V[i];
		return x;
	} Scope.amend=amend;
	function copy(x) { return jd(je(x)); } Scope.copy=copy;
	function eq(x,y) { //emit([x,y],'equal');
		if (typeof(x)!==typeof(y)) return false;
		if (Array.isArray(x) && Array.isArray(y) && x.length!=y.length) return false;
		if (typeof(x)!=='object' && x==y) return true; //simple values - hopefully
		return JSON.stringify(x)==JSON.stringify(y); } Scope.eq=eq;
	function empty(x) { return len(x)===0; } Scope.empty=empty;
	function first(x) {
		if(!tarray(x)) throw 'first(): x::array';
		return x[0]; } Scope.first=first;
	function ins(x,y) {
		if(tstr(x)&&tstr(x)) { return x+y; }
		if(tstr(x)&&tarray(y)&&tstr(y[0])) { return x+over(ins,y) }/*!killme*/
		if(tarray(x)) { var r=copy(x);r.push(y);return r; }
		if(tdict(x)&&tdict(y)) { return Object.assign(x,y); }
		return [x,y]; } Scope.ins=ins;
	function last(x) {
		if(!tarray(x)) throw 'last(): x::array';
		return x[len(x)-1]; } Scope.last=last;
	function len(x) { 
		const tx=typeof(x);
		if(tarray(x)||tstr(x)) return x.length;
		else if (tx==='object') {
			if (x.hasOwnProperty('len')) return x.len();
			else if (x.hasOwnProperty('length')) { return x.length; }
			else return Object.keys(x).length;
		};
		throw 'len: bad arg';
	} Scope.len=len;
	function max(min,max) { if(tarray(min)) return Math.max.apply(null,min); else return Math.max(min,max);  }
	Scope.max=max;
	function min(mm,mx) { if(tarray(mm)) return Math.min.apply(null,mm); else return Math.min(mm,mx); }
	Scope.min=min;
	function issym(x) { return tarray(x)&&tstr(x[0])&&x[0][0]=='$'?true:false; } Scope.issym=issym;
	function $sym(x) {
		if(issym(x)) return x[0];
		return false;
	} Scope.$sym=$sym;
	function take(x,n) {
		let st,en=n,i,R=[],xn=len(x);
		if(n<0) st=xn-n; else st=0;
		for(i=st;i<en;i++) R.push(x[i % xn]);
		return R;
	} Scope.take=take;
	// Values: Sorting..
	function sort(retcodes, vals, keyOpt) {
		const tv=t(vals);
		if (tv==='array') {
			if (keyOpt) return vals.sort(function(a,b) {
					const ak=a[keyOpt], bk=b[keyOpt];
					return ak==bk ? 0 : (ak < bk ? retcodes[0] : retcodes[1]);
				});
			else return vals.sort(function(a,b) { return a==b?0:(a<b?retcodes[0]:retcodes[1]); });
		}
		throw 'sort(): not yet implemented'; } Scope.sort=sort;
	function asc(vals, key) { return sort([-1, 1], vals, key); } Scope.asc=asc;
	function desc(vals, key) { return sort([1, -1], vals, key); } Scope.desc=desc;
	// Values: Types..
	function t(x) { 
		if (Array.isArray(x)) return 'array';
		const t=typeof(x);
		if (x===U||t===U) return 'undef';
		if (t==='number' && Math.floor(x)==x) return 'int'; /*lame*/
		else if (t==='number') return 'float'; /*lame*/ else if (t==='function') return 'func';
		return t; /*fallthru*/ } Scope.t=t;
	function tarray(x) { return Array.isArray(x); } Scope.tarray=tarray;
	function tstr(x) { return typeof(x)==='string'; } Scope.tstr=tstr;
	function tbox(x) { return typeof(x)==='object' || Array.isArray(x); } Scope.tbox=tbox;
	function tdict(x) { return typeof(x)==='object' && !Array.isArray(x); } Scope.tdict=tdict;
	function tfunc(x) { return typeof(x)==='function'; } Scope.tfunc=tfunc;
	function tU(x) { return x===undefined; } Scope.tU=tU;
	// Debugging:
	Scope._req=function _req(fs) {
		if(typeof require=='undefined') throw('_req(): cannot get '+fs);
		return require(fs); }
	function assert(v,exp,msg) { if(!eq(v,exp)) { emit([v,exp],'assertion failed: '+msg); process.exit(1); } if(SHOWASSERT)emit(msg,'passed:'); return v; }
	Scope.assert=assert;
	function emit(x,y){if(y!==undefined)console.log(y,': '); console.log(x);return x;} Scope.emit=emit;
	function noemit(x,y){return x;} Scope.noemit=noemit;
	function ordie(value, exc) { if(tU(value)) throw exc; else return value; } Scope.ordie=ordie;
	// System:
	function file(fn, contentsOpt) {
		var fs=_req('fs');
		if(tU(contentsOpt)) return fs.readFileSync(fn,'utf-8');
		else return fs.writeFileSync(fn,contentsOpt,'utf-8'); }
	Scope.file=file;
	function jd(x) { return JSON.parse(x); } Scope.jd=jd;
	function je(x) { return JSON.stringify(x); } Scope.je=je;
	// More trippy stuff
	function each(x,f) { var R=[]; for(var i=0;i<x.length;i++) R.push(f(x[i],i)); return R; }
	Scope.each=each;
	function eachleft(x,f) {
		if(!tarray(x) || x.length != 2 || !tarray(x[0])) throw 'eachLeft(): x must be [ [1, 2, 3], 10 ]';
		const x0=x[0],x0n=x0.length,x1=x[1]; var i,R=[];
		for(i=0;i<x0n;i++) R.push(f(x0[i],x1,i));
		return R;
	} Scope.eachleft=eachleft;
	function eachright(x,f) {
		if(!tarray(x) || x.length != 2 || !tarray(x[1])) throw 'eachLeft(): x must be [ 10, [1, 2, 3] ]';
		const x0=x[1],x0n=x0.length,x1=x[0]; var i,R=[];
		for(i=0;i<x0n;i++) R.push(f(x1,x0[i],i));
		return R;
	} Scope.eachright=eachright;
	function eachboth(x,f) {
		if(!tarray(x) || x.length != 2 || !tarray(x[0]) || !tarray(x[0]) || len(x[0]) != len(x[1])) throw 'eachboth: [ [1,2,3],[10,20,30] ]';
		const xn=len(x[0]); var i=0,R=[];
		for(;i<xn;i++) R.push(f(x[0][i],x[1][i],i)); 
		return R;
	} Scope.eachboth=eachboth;
	function over(x,f,val) { // binary function f; (f..(f(f(x[0],x[1]),x[2]),x[3...]))
		if(!tarray(x)) throw 'over(): x must be array';
		if(tU(val)) val=x.shift();
		const xn=len(x); for(let i=0;i<xn;i++) val=f(val,x[i]);
		return val;
	} Scope.over=over;
	function projleft(f,x)  {return function(y) {return f(x,y);}} Scope.projleft=projleft;
	Scope.projleft=projleft;
	function projright(f,y) {return function(x) {return f(x,y);}} Scope.projright=projright;
	Scope.projright=projright;
	function scan(x,f,val) { // binary function f; [ f(x[0],x[1]), f(f(x[0],x[1]),x[2]), ... ]
		if(!tarray(x)) throw 'scan(): x must be array';
		if(tU(val)) val=x.shift();
		const xn=len(x); let R=[]; for(let i=0;i<xn;i++) R.push(val=f(val,x[i]));
		return R;
	} Scope.scan=scan;

	// "Recursive combinators"

	function alike(x, f) {
		x=copy(x);
		var i,r;
		for(i=1;i<len(x);i++) {
			// emit(x[i],'alike '+i+'/'+len(x)); emit(issym(x[i])); emit(issym(x[i-1]));
			if(x[i]==x[i-1] ||
				 (issym(x[i]) && issym(x[i-1]) 
				  && ($sym(x[i]) == $sym(x[i-1])))) { 
				// emit(i,'combalikematch');
				r=f(x[i-1],x[i],i);
				// emit(r,'combr');
				if(!tU(r)) { 
					x.splice(i-1, 2, r); i-=2; //emit(x,'postsplice');
				} } }
		return x;
	} Scope.alike=alike;
	function exhaust(x,f,opt) {
		var last=x,iter=0;
		while (1) { x=last; last=f(x,opt,iter); if (eq(x,last)) return last; if (iter++==MAXITER) return last; }
	} Scope.exhaust=exhaust;
	function wide(x,f,last,path) { 
		emit(x,'wide');
		if(tU(x) || !tarray(x)) return x;
		let xl=x.length; if(xl==0) return x;
		if(last==undefined) last=x;
		if(path==undefined) path=[];
		let R=[];
		for (let i=0;i<xl;i++) {
			if(tarray(x[i])) { 
				var p=ins(path,i); last=wide(f(x[i],last,p),f,last,p); 
				if(!tU(last)) R.push(last); }
			else R.push(x[i]);
		}
		return R;
		//[ [ 49, 2, [ 147, 4 ] ], 8 ]
		//[ [ 7, 2, [ 21, 4 ] ], 8 ]
	}
	Scope.wide=wide;
	function deep(x,f,last,path) { 
		if(!tarray(x)) throw 'deep(): arg not list';
		let xl=x.length; if(xl==0) return x;
		if(last==undefined) last=x;
		if(path==undefined) path=[];
		let R=[];
		for (let i=0;i<xl;i++) {
			var p=ins(path,i); 
			if(tarray(x[i]) && !issym(x[i])) last=deep(x[i],f,last,p); else last=f(x[i],last,p);
			if(!tU(last)) R.push(last);
		}
		return R;
	}
	Scope.deep=deep;
	function get(x,idx) {
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
	Scope.get=get;
	function match(x,patterns) {
		if(!tarray(x)) throw 'match(): x must be [ ["$syma"],["$symb",3,4,5] ]';
		noemit(x,'match x');
		noemit(patterns,'match pat');
		var R=[];
		function visitSym(x, last, path) { 
			if(x[0]==patterns) R.push(emit(path,'visitSym')); return x; }
		function visitVal(x, last, path) { 
			if(x==patterns) R.push(path); return x; }
		function visitAnd(x, last, path) {
			let i,j, patn=len(patterns), xn=len(x);
			for(i=0;i<xn;i++) {
				noemit(i,'i');
				var matchval=[];
				var found=1;
				var xij,pj;
				for(j=0;j<patn;j++) {
					noemit(j,'j');
					pj=patterns[j]; xij=x[i+j];
					if(issym(pj) && $sym(pj) == $sym(xij)) {
						noemit([pj,$sym(pj),xij,$sym(xij)],'visitAnd match');
						continue;
					}
					if(pj == xij) {
						noemit([pj,xij],'visitAnd value match'); continue; }
					found=0;
					break;
				}
				if (found && j==patn) {
					var p=ins(path,i);
					emit(p,'visitAnd adding path');
					emit(i,'visitAnd i');
					emit(xij,'visitAnd value xij');
					R.push(p); // made it this far, pattern matched
				}
			}
			return x; }
		var z;
		if(tarray(patterns)) {
			let op=$sym(patterns); 
			if(op=='$and') { 
				patterns=patterns[1]; 
				z=wide(x,visitAnd);
			}
		}
		if(patterns[0]=='$') z=wide(x,visitSym);
		else z=deep(x,visitVal);
		return R;
	}
	Scope.match=match;

	function resolve(x, patterns) {
		// patlist like
		//   [  2, numhandler, 3, numhandler, '$thing', thinghandler, elsehandler.. ]
		if(!tarray(patterns)) throw 'resolve(): patterns must be [val, func, "$sym", func, elsefunc]';
		var patn=len(patterns);
		function _resolve0(x, last, path) {
			var i;
			emit(x,'resolve0');
			for(i=0;i<patn;i+=2) {
				if(patterns[i][0]=='$' && x[0]==patterns[i] ||
					 patterns[i]==x ||
					 (patterns[i].test && patterns[i].test(x))) {
					emit(patterns[i],'resolve sym match');
					var fn=patterns[i+1];
					if(tfunc(fn)) x=fn(x); else x=fn;
					emit(x,'amended');
					continue;
				}
			}
			return x;
		}
		var z=deep(x, _resolve0);
		return z;
	}
	Scope.resolve=resolve;

	function _nest0(L, open, close, cb, path) {
		emit(L,'start _nest0 '+path);
		const LL=L.length; var opens=[],R=[],i;
		if(LL==0) return L;
		R=L;
		for(i=0; i<LL; i++) {
			if(L[i]==close) { 
				if (opens.length==0) throw 'nest(): imbalanced';
				var oidx=opens.pop();
				var inner=R.slice(oidx+1, i); 
				emit(R,'presplice');
				if(cb) { inner=emit(cb(inner),'nest-inner-cb'); }
				R.splice(oidx, i-oidx+len(open)+len(close)-1, inner);
				emit(R,'recurse');
				return _nest0(R, open, close, cb, ins(path,i));
				emit([oidx,i],'replacing');
				//emit(ins(path,i),'_nest0 path');
			} else {
				if(L[i]==open) opens.push(i);
			}
		}
		emit(R,'_end nest0 '+path);
		return R;
	}
	function _nest1(L, open, close, cb, path) {
		emit(L,'start _nest1 '+path);
		const LL=L.length; var opens=[],R=[],i;
if(LL==0) return L;
		R=L;
		for(i=0; i<LL; i++) {
			if(L[i]==open) {
				if(len(opens)==0) { opens.push(i); continue; }
				emit(i,'found close');
				if (opens.length==0) throw 'nest(): imbalanced';
				var oidx=opens.pop();
				var inner=R.slice(oidx+1, i); 
				emit(R,'presplice');
				if(cb) { inner=emit(cb(inner),'nest-inner-cb'); }
				R.splice(oidx, i-oidx+len(open)+len(close)-1, inner);
				emit(R,'recurse');
				return _nest1(R, open, close, cb, ins(path,i));
				emit([oidx,i],'replacing');
				//emit(ins(path,i),'_nest0 path');
			}
		}
		emit(R,'_end nest1 '+path);
		return R;
	}
	function nest(L, open, close, handlecb) {
		if(!tarray(L)) throw('nest(): L::array');
		L=[L];
		emit(L,"nest");
		var nestfn=(open == close)?_nest1 : _nest0;
		R=wide(L,function(x,last,path){return nestfn(x,open,close,handlecb,path);});
		return R;
	}
	Scope.nest=nest;
	Scope.selftest=function() {

		assert($sym(make(1,'$z')),'$z','sym0');
		assert(issym(make(2,'$bbbb')),true,'sym1');

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
		var t_sym=[ ['$name','Bob'], make(30,'$age'), ['$parents',['$name','Olga'],make('Sam','$name')]];
		var c=wide(t_sym,function(x){if(first(x)=='$name')x[1]=x[1].toUpperCase();return x;});
		assert(first(c)[1],'BOB','wide0sym');

		var c=wide(t_sym,function(x){emit(x,'t_sym_f'); if (x[0]=='$age') return x;});
		emit(c,'wide-c');
		assert(len(c)==1 && len(c[0])==2 && first(c)[0],'$age','wide1sym');
		var d=match(t_sym, '$name');
		var e=eachright([t_sym,d],get);
		assert(len(e),len(d),'match-er-0');

		emit(d);
		emit(e);

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
		var q=[1, 2, [3, 4]];
		amend(q,0,5);
		assert(q[0],5,'amend0');
		qq=amend(q,[0,1],[8,9]);
		assert(qq,[8,9,[3,4]],'amend1');
		qqq=amend(q,2,function(x){return [x[0]*2,x[1]*3]});
		assert(qqq,[8,9,[6,12]],'amend2');

		var d=[1], p=[1], r=match(d,p);
		assert(r,[[0]],'m1-t1');
		var d=[1], p=['$and',[1]], r=match(d,p);
		assert(r,[[0]],'m1-t2');
		var d=[1], p=['$and',[1,2]], r=match(d,p);
		assert(r,[],'m1-t3');
		var d=[[1,2]], p=['$and',[1,2]], r=match(d,p);
		assert(r,[[0,0]],'m1-t4');
		var d=[1,2], p=['$and',[1]], r=match(d,p);
		assert(r,[[0]],'m1-t5');

		var md=[[1,2]];
		var m1=match(md,make([1,2],'$and'));
		assert(m1,[[0,0]],'match AND 1');
		var m1=match(md,make([1,2,1],'$and'));
		assert(m1,[],'match AND 2');
		assert(match([[1,2,1]],['$and',[1,2]]),[[0,0]],'match AND 3');
		assert(match([[1,2,1]],['$and',[2,1]]),[[0,1]],'match AND 4');
		assert(match([[1,2,1]],['$and',[1,2,1]]),[[0,0]],'match AND 5');

		var d=[[1,2,1]], p=['$and',[1]], r=match(d,p);
		emit(r,'r');
		emit('all tests','passed');
	}
	return Scope;
}

if(typeof(module)!='undefined') {
	module.exports = xact; 
}

