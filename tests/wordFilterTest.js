WordFilter=require("../wordFilter")
GrammarField=require("../grammarField")


function alwaysTrue()
{
	return true
}
wf=new WordFilter.CompositeWordFilter([new WordFilter.KeywordsFilter(["dog"],"any"),new WordFilter.WordFilter([alwaysTrue])])

gf1=new GrammarField(["the quick brown fox","jumped over the lazy dog"],[0,1],wf)
gf1.toPng("test1.png")

gf2=new GrammarField(["the quick brown fox","jumped over the lazy dog"],[0,1])
gf2.toPng("test2.png")
