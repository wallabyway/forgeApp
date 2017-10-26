import { StyleSheet, Dimensions } from 'react-native';

let width = Dimensions.get('window').width;

const primaryColor = "#42a";
const dullColor = "#aaa";
const backgroundColor = '#eee';
const backgroundDullColor = '#ddd';

export const styles = StyleSheet.create({
	h1: {
	    fontSize:18,
	    color: primaryColor,
        width: width
	},

    h2: {
        paddingLeft: 30,
        width: width,
    },

	container: {
	    flex: 1,
	    backgroundColor: backgroundColor,
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
		borderColor: dullColor,
        width: width
	},

	photo: {
		width:width,
        height:width
	}

});

styles.tabIcon_Selected = primaryColor;
styles.tabIcon = dullColor;
styles.tabBackgroundColor = backgroundDullColor;

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

            function initializeViewer(urn, token) {
                var options = {
                    env: "AutodeskProduction",
                    useConsolidation: false,
                    useADP: false,
                    accessToken: token
                };

                function onSuccess(doc) {
                    function onLoadModelSuccess() {
                        viewer.setBackgroundColor(40,40,30,255,255,255);
                        viewer.setLightPreset(17);
                    }

                    // A document contains references to 3D and 2D viewables.
                    var viewables = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {'type':'geometry'}, true);
                    var initialViewable = viewables[0];
                    var svfUrl = doc.getViewablePath(initialViewable);
                    var modelOptions = {
                        sharedPropertyDbPath: doc.getPropertyDbPath()
                    };
                    var viewerDiv = document.getElementById('viewer');
                    viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerDiv);
                    viewer.start(svfUrl, modelOptions, onLoadModelSuccess);
                };
                Autodesk.Viewing.Initializer(options, function onInitialized(){
                    Autodesk.Viewing.Document.load(urn, onSuccess);
                });
            };
        </script>
    `;