import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'


export class News extends Component {

    static defaultProps = {
      country: 'in',
      category: 'general'
    }
    static propTypes = {
      country: PropTypes.string,
      category: PropTypes.string,
    }

    page = 1
    constructor(props){
        super(props);
        this.state = {
            articles: [],
            loading: false,
            totalResults: 0
        }
        document.title = `${this.captalize(this.props.category)} - NewsMonkey`
    }

    captalize = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }

    async updateNews(){
      let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=754affa398dc4b7ca42ced39cdaab7dc&page=${this.page}&pageSize=${this.props.pageSize}`
      this.setState({loading:true})
      let data = await fetch(url)
      let parsedData = await data.json()
      this.setState({articles: parsedData.articles,totalResults: parsedData.totalResults,loading:false})
    }

    async componentDidMount(){
      this.updateNews()
    }

    handlePrevBtn = async () =>{
      this.page = this.page - 1 
      this.updateNews()
    }

    handleNextBtn = async () =>{
      this.page = this.page + 1
      this.updateNews()
    }

  render() {
    return (
      <div className="container">
        <h1 className="text-center" style={{color: "white",margin:"30px 0px"}}>NewsMonkey - Top {this.captalize(this.props.category)} Headlines</h1>
        {this.state.loading && <Spinner/>}
        <div className="row my-3">
        {!this.state.loading && this.state.articles.map((element)=>{
            return <div className="col-md-4 my-2" key={element.url}>
                        <NewsItem title={element.title?element.title:""} description={element.description?element.description:""} imageUrl={element.urlToImage?element.urlToImage:""} newsUrl={element.url?element.url:""} author={element.author?element.author:"Unknown"} time={element.publishedAt?element.publishedAt:""} source={element.source.name?element.source.name:""}/>
                    </div>
        })}
            
        </div>
        <div className="conatiner d-flex justify-content-between">
          <button disabled={this.page<=1} type='button' onClick={this.handlePrevBtn} style={{marginBottom:"3px"}} className='btnNP mx-1'>&larr; Previous</button>
          <button disabled={this.page>=Math.ceil(this.state.totalResults/this.props.pageSize)} type='button' onClick={this.handleNextBtn} style={{marginBottom:"3px"}} className='btnNP mx-1'>Next &rarr;</button>
        </div>
        
           
      </div>
    )
  }
}

export default News
