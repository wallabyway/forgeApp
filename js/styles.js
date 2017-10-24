import { StyleSheet, Dimensions } from 'react-native';

let width = Dimensions.get('window').width;

const primaryColor = "#a24";
const dullColor = "#aaa";

export const styles = StyleSheet.create({
	h1: {
	    fontSize:22,
	    color: primaryColor
	},

	container: {
	    flex: 1,
	    backgroundColor: '#fff',
	    alignItems: 'center',
	    justifyContent: 'center',
	},

	webview: {
		width: width
	},

	listitem: {
		flexDirection: 'row',
		padding: 10,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: '#ecf0f1',
        width: width
	},

	photo: {
		width:50,
		height:50
	}

});

styles.tabIcon_Selected = primaryColor;
styles.tabIcon = dullColor;

styles.viewerHTML = `
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <link rel="stylesheet" href="https://developer.api.autodesk.com/derivativeservice/v2/viewers/style.min.css?v=v2.17" type="text/css">
            <script src="https://developer.api.autodesk.com/derivativeservice/v2/viewers/three.min.js?v=v2.17"></script>
            <script src="https://developer.api.autodesk.com/derivativeservice/v2/viewers/viewer3D.js?v=v2.17"></script>
            <!--script src="https://viewer-nodejs-tutorial.herokuapp.com/extensions/Viewing.Extension.Markup3D.min.js"></script-->
        </head>
        <body style="margin:0"><div id="viewer"></div></body>
        <script>
            var viewer;
            var viewerDiv = document.getElementById('viewer');
            document.addEventListener("message", function(msg) { }, false);

            function initializeViewer(urn, token) {
                var options = {
                    env: "AutodeskProduction",
                    useConsolidation: false,
                    useADP: false,
                    accessToken: token
                };

                function onSuccess(doc) {
                    // A document contains references to 3D and 2D viewables.
                    var viewables = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {'type':'geometry'}, true);
                    var initialViewable = viewables[0];
                    var svfUrl = doc.getViewablePath(initialViewable);
                    var modelOptions = {
                        sharedPropertyDbPath: doc.getPropertyDbPath()
                    };

                    var viewerDiv = document.getElementById('viewer');
                    viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerDiv);
                    viewer.start(svfUrl, modelOptions);
                    viewer.setBackgroundColor(200,200,200,255,255,255);
                };
                Autodesk.Viewing.Initializer(options, function onInitialized(){
                    Autodesk.Viewing.Document.load(urn, onSuccess);
                });
            };
        </script>
    `;