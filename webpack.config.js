const path = require('path');
//Se añade este recurso del plugin de HTML
const HtmlWebpackPlugin = require('html-webpack-plugin');
//Se añade este recurso del plugin de CSS
const MiniCssExtracPlugin = require('mini-css-extract-plugin');
//Se añade este recurso de plugin de copy (Copia de archivos)
const CopyPlugin = require('copy-webpack-plugin');
//Se añade  este recurso de plugin (comprimir archivos css)
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
//Se añade este recurso de plugin (permite mimificar de una mejor forma)
const TerserPlugin = require('terser-webpack-plugin');
//Se añade este recurso de plugin (entorno que solo exponer lo que elige y usa)
const Dotenv = require('dotenv-webpack');
//Se añade este recurso del plugin (Elimina/limpia las carpetas de compilacion)
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
    //Entry nos permite decir el punto de entrada de nuestra aplicación
    entry: "./src/index.js",
    //Output nos permite decir hacia dónde va enviar lo que va a preparar webpacks
    output: {
        //path es donde estará la carpeta donde se guardara los archivos 
        //Con path.resolve podemos decir dónde va estar la carpeta y la ubicación del mismo 
        //resolve lo que hace es darnos la ruta absoluta de el S.O hasta nuestro archivo para no tener conflictos entre Linuz, Windows, etc
        path: path.resolve(__dirname,"dist"),
        //filname le pone el nombre del archivo final 
        filename: '[name].[contenthash].js',
        //Mover las imagenes a la carpeta assets
        assetModuleFilename: 'assets/images/[hash][ext][query]'
    },
    resolve:{
        //Aqui ponemos las extensiones que tendremos en nuestro proyecto para webpack los lea 
        extensions:[".js"],
        alias:{
            //Alias: @utils  path: Para saber donde estamos resolve(__dirname): ruta absoluta donde se encuentra el archivo 
            '@utils':path.resolve(__dirname,'src/utils/'),
            '@templates':path.resolve(__dirname,'src/templates/'),
            '@styles':path.resolve(__dirname,'src/styles/'),
            '@images':path.resolve(__dirname,'src/assets/images/')
        }
    },
    module: {
        //rules: reglas que se van a establecer para como vamos a trabajar con los distintos tipos de archivos o elementos dentro del proyecto 
        rules:[
            //El objeto va ser para trabajar con babel loader y poder conectar nuestro webpack con babel 
            {
                //test: nos va permitir saber de que tipo de extenciones vamos a utilizar, para ellos es necesario trabajar con expresiones regulares que nos van a decir como puede trabajar con distintas extensiones 
                test: /\.m?js$/, //Expresion regular, utiliza cualquier extension que sea mjs (modulos) o js
                //exlude: permite omitir archivos o carpetas especificas
                 exclude: /node_modules/,
                 //Para pasarle internamente lo que viene siendo el loader que vamos a utilizar  
                 use:{
                     loader:'babel-loader'
                 }
            },
            {
                test: /\.css|.styl$/i,//Expresion regular, va utilizar .css 
                //Use: para poder decirle cual es el elemento que vamos a tener
                use:[MiniCssExtracPlugin.loader,'css-loader','stylus-loader'],
            },
            {
                test: /\.png/, //Expresion regular, va utilizar la extencion .png
                //Tipo de módulo a usar 
                type: "asset/resource"
            },
            {
                test: /\.(woff2?|ttf|eot)(\?v=\w+)?$/,//Expresion regular, regla para archivos WOFF y WOFF2
                //Use: para poder decirle cual es el elemento que vamos a tener
                type: 'asset/resource',
                generator: {
                  filename : 'fonts/[name][ext][query]',
                }
            }
        ]
    },
    plugins:[
    //hacemos una instancia de lo que definimos en el inicio del archivo
    // le añadimos por parametro un objeto donde vamos a tener las 
    //configuraciones que le vamos anadir a nuestro plugin HTML
    new HtmlWebpackPlugin({

        //inyecta el bundle al template html
        inject: true,
        //la ruta al template html
        template: './public/index.html',
        //nombre final del archivo
        filename: './index.html' 
  
      }),
      //Creamos un nuevo plugin para css
      new MiniCssExtracPlugin({
          filename:'assets/[name].[contenthash].css'
      }),
      //Creamos una nueva instanacia 
      new CopyPlugin({
          patterns: [
            {
                //path es donde estará la carpeta donde se guardara los archivos 
                //Con path.resolve podemos decir dónde va estar la carpeta y la ubicación del mismo    
                from: path.resolve(__dirname,"src","assets/images"),
                to: "assets/images"
            }
          ]
      }),
      new Dotenv(),
      new CleanWebpackPlugin()
    ],
    optimization: {
        minimize: true
      }
}
