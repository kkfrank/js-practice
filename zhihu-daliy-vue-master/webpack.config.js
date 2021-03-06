var BundleAnalyzerPlugin=require('webpack-bundle-analyzer').BundleAnalyzerPlugin
var webpack=require('webpack')
var ExtractTextPlugin=require('extract-text-webpack-plugin')
module.exports={
	entry:{
		bundle:'./src/index.js',
		vendor:['vue-awesome','vue','vue-router','moment','vue-awesome/icons','vuex','axios','es6-promise']
	},
	output:{
		publicPath:"/assets",
		path:__dirname+'/dist',
		filename:'[name].js'
	},
	module:{
		rules:[
	/*	{
			test:/\.scss$/,
			use:[{
				loader:'style-loader'
			},{
				loader:'css-loader'
			},{
				loader:'sass-loader'
			}]
		},*/
		{
			test:/\.js$/,
			exclude:/node_modules/,
			use:[{
				loader:'babel-loader'
			}]
		},{
			test:/\.vue$/,
			use:[{
				loader:'vue-loader',
				options:{
					extractCSS:true
				}
			}]
		},{
			test:/\.(png|jpg|gif)$/,
			use:[{
				loader:'file-loader'
			}]
		}]
	},
	resolve:{
		extensions:['.js','.vue'],
		alias:{
			'vue':'vue/dist/vue.js'
		}
	},
	devServer:{
		//compress:true
		port:9000
	},
	devtool:'cheap-eval-source-map',
	plugins:[
		//new BundleAnalyzerPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name:"vendor"
		}),
		//new ExtractTextPlugin('style.css')
		new ExtractTextPlugin('[name].css')
	]
}