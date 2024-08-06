import Document, { Html, Head, Main, NextScript } from "next/document"; 

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <head>
                    <link rel="manifest" href="/manifest.json"/>
                    <link rel="icon-192x192" href="/public"/>
                    <meta name="theme-color" content="#fff"/>
                </head>
                <body>
                    <main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}