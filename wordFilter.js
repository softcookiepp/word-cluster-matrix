const WORD_FILTER_VALIDATION_ERROR_MESSAGE="wordFilters must be a list containing only functions that meet the following criteria:\n1) must take a string as a single argument\n2) must return true if string meets criteria and false if it does not."

class WordFilter
{
	/*
	 * A class that will filter sentences based on a list of functions.
	 * Functions in the wordFilters argument should return true if a sentence is to be kept, false if not.
	 */
	constructor(wordFilters=[])
	{
		this.wordFilters=wordFilters;
		//validate word filters. Word filters must be functions.
		for(let i=0;i<this.wordFilters.length;i++)
		{	
			if(typeof(this.wordFilters[i])!="function")
			{
				throw new TypeError(WORD_FILTER_VALIDATION_ERROR_MESSAGE)
			}
		}
		this.sentences=[]
		this.times=[]
	}
	
	/*
	 * returns a list of filtered sentences based on criteria specified on initialization
	 */
	filter(sentences,times)
	{
		//reinitialize in case filter is used more than once
		this.sentences=[]
		this.times=[]
		
		//iterate over each sentence and time
		for(let iS=0;iS<sentences.length;iS++)
		{
			var sentence=sentences[iS]
			var time=times[iS]
			
			//iterate over each filter, check every criteria
			var sentencePasses=true
			for(let iF=0;iF<this.wordFilters.length;iF++)
			{
				var currentFilter=this.wordFilters[iF]
				sentencePasses=currentFilter(sentence)
				
				//break if false
				if(sentencePasses==false)
				{
					break
				}
			}
			
			if(sentencePasses)
			{
				this.sentences.push(sentence)
				this.times.push(time)
			}
		}
		return [this.sentences,this.times]
	}
}




class KeywordsFilter extends WordFilter
{
	/* 
	 * A basic keyword-based filter that can be used to avoid needlessly declaring a bunch of functions if you only need simple features.
	 * Valid modes are "every" , "any" , "none" , "not_all"
	 * if "every", a given sentence must contain all of the specified keywords in order to pass through the filter.
	 * if "any", a given sentence must contain any of the specified keywords.
	 * if "none", a given sentence must not contain any of the specified keywords.
	 * if "not_all", a given sentence must not contain all of the specified keywords, but sentences containing some of the keywords will return true.
	 */
	constructor(keywords=[],mode="every",caseSensitive=false)
	{
		if(mode!="every" && mode!="any" && mode!="none" && mode!="not_all")
		{
			throw new Error("Invalid mode. mode must be set to \"every\" or \"any\".")
		}
		super([])
		this.caseSensitive=caseSensitive
		this.keywords=keywords
		this.mode=mode
		this.wordFilters.push(this.filterKeywords.bind(this))
	}
	
	
	filterKeywords(sentence)
	{
		if(this.caseSensitive==false)
		{
			sentence=sentence.toLowerCase()
		}
		
		sentence=sentence.split(" ")
		
		var includesCurrentKeyword=true
		for(let iKW=0;iKW<this.keywords.length;iKW+=1)
		{
			var keyword=this.keywords[iKW]
			if(this.caseSensitive==false)
			{
				keyword=keyword.toLowerCase()
			}
			
			var includesCurrentKeyword=sentence.includes(keyword)
			
			if(this.mode=="every")
			{
				if(includesCurrentKeyword==false)
				{
					return false
				}
			}
			else if(this.mode=="any")
			{
				
				if(includesCurrentKeyword)
				{
					return true
				}
			}
			else if(this.mode=="none")
			{
				if(includesCurrentKeyword)
				{
					return false
				}
			}
			else if(this.mode=="not_all")
			{
				if(includesCurrentKeyword==false)
				{
					return true
				}
			}
		}
		return includesCurrentKeyword
	}
	
}


class CompositeWordFilter
{
	/* 
	 * An class used to chain multiple WordFilter objects together.
	 */
	constructor(wordFilters)
	{
		this.filters=wordFilters
		this.sentences=[]
		this.times=[]
		for(let iF=0;iF<this.filters.length;iF++)
		{
			var filter=this.filters[iF]
			const constructorStr=filter.constructor.toString().split("\n")[0]
			//this is poojeet-quality code, but I literally have no idea how else to do this,
			//given that instanceof doesn't work when this is used as a module
			if(  (!constructorStr=="class WordFilter") && (!constructorStr.includes("extends WordFilter"))  )
			{
				throw new TypeError("wordFilters must exclusively consist of objects derived from WordFilter")
			}
			
		}
	}
	filter(sentences,times)
	{
		this.sentences=sentences
		this.times=times
		for(let i=0;i<this.filters.length;i++)
		{
			var filter=this.filters[i]
			var st=filter.filter(sentences,times)
			sentences=st[0]
			times=st[1]
		}
		this.sentences=sentences
		this.times=times
		return [this.sentences,this.times]
	}
}


module.exports={WordFilter:WordFilter,KeywordsFilter:KeywordsFilter,CompositeWordFilter:CompositeWordFilter}
