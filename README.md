# SVNode v0.6 by [@michalbe](http://github.com/michalbe) #
SVN UI for commandline

### What? ###
Let's image it's still early 2001 again and you track your project's progress in [Subversion](https://en.wikipedia.org/wiki/Apache_Subversion), or you just work in a huge corporation that forces you to do so because there is too many projects to migrate them all or something. As you probably know, it's pain in the ass to use it from the command line, and there are no smart tools that will do it for you and run on non-windows platforms in the same time. So here is `svnode`. It does exactly what you expect (or it will, so far status, commit and simple log functionalities only).

![svnode](https://raw.githubusercontent.com/michalbe/svnode/master/screen.png)

### How to use? ###
Install with:
```
 $ sudo npm install svnode -g
```

Then in the `svn` repo:
```
$ svnode
```

Voila!

### Whats new ###

 - __v0.6__ (04.12.2015)
   - `svn status` support added. It displays simple list of last 5 revisions

### TODO ###
Soon-to-be-implemented features are described [here](https://github.com/michalbe/svnode/issues).
