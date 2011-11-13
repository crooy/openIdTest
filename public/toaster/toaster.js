

pkg = ( ns )->
	curr = null
	parts = [].concat = ns.split( "." )
	for part, index in parts
		if curr == null
			curr = eval part
			continue
		else
			unless curr[ part ]?
				curr = curr[ part ] = {}
			else
				curr = curr[ part ]
	curr

document.write('<scri'+'pt src="./toaster/src/actor.js"></scr'+'ipt>')
document.write('<scri'+'pt src="./toaster/src/facebook.js"></scr'+'ipt>')
document.write('<scri'+'pt src="./toaster/src/user.js"></scr'+'ipt>')
