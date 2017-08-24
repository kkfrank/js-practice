const webpack=require('webpack')
const HtmlWebpackPlugin= require('html-webpack-plugin')
module.exports={
	entry:"./src/app.js",
	output:{
		path:__dirname+"/build",
		publicPath:"build",
		filename:"bundle.js"
	},
	devtool:"eval-source-map",
	devServer:{
		//contentBase:"public",
		port:8010,
		historyApiFallback:true,
		compress:true,
		hot:true
	},
	module:{
		rules:[
			{
				test:/(\.js|.jsx)$/,
				use:"babel-loader",
				exclude:/node_modules/
			},
			{
				test:/(\.css|.scss)$/,
				use:["style-loader","css-loader","sass-loader"]
			}
		]
	},
	plugins:[
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({template: './index.html'})
	]
}