#library(shiny)
shinyUI(fluidPage(
	theme="styles/theme.css",
	tags$title("SPAGE"),
	fluidRow(
		tags$h2("Survival Associated Pairwise Gene Expression States",id="logo")
	),
	fluidRow(class="content",
		column(9,class="display",tags$div(
			tags$canvas(id="canvas",onclick="clickCanvas()"),
			tags$div(class="hide-data",
				plotOutput("km",width=700,height=350),
				textOutput("description"),
				textOutput("nodeData")
			),
			tags$script(src="scripts/html2canvas.min.js"),
			tags$script(src="scripts/draw-network.js"),
			tags$script(src="scripts/pdf-export.js"),
			tags$script(src="scripts/legend.js"),
			tags$script(src="scripts/filters.js"),
			tags$script(src="scripts/frontEnd.js"),
			tags$script(src="scripts/suggestions.js"),
			tags$script(src="scripts/km-plots.js"),
			tags$script(src="scripts/dimens.js"),
			tags$script(src="scripts/click.js"),
			tags$script(src="scripts/jspdf.js")
	)),
	column(3,class="sidebar",
		fluidRow(
			textInput("searched","Search Genes...",value="brca1,myc",placeholder="ex. ABI1,A2M,ABCD1"),
			tags$span(id="sugCon",
				uiOutput("suggestions")
			)
		),fluidRow(
			tags$br(),
			tags$input(type="file",id="uploader",multiple="false",onchange="onUpload()"),
			tags$input("Filter single-interaction nodes",type="checkbox",id="filter"),
			tags$br(),
			tags$input("Use Target-Specific FDR",type="checkbox",id="TS"),
			tags$div(class="dropdown",
				tags$button("Filter Interaction Type",tags$span(class="caret"),class="btn btn-primary dropdown-toggle",type="button"),
				tags$ul(class="dropdown-menu")
			),
			tags$input(value="Apply Filter",type="button",onclick="applyBinFilter()"),
			tags$br(),
			tags$label("Zoom: "),
			tags$button("+",class="zoomIn"),
			tags$button("-",class="zoomOut"),
			tags$br(),
			tags$label("Legend"),
			tags$br(),
			tags$img(id="legendsmall",src="legend.png"),
			tags$br(),tags$br(),
			tags$button("Export",class="pdf-export"),
			tags$span("Export network as PDF"),
			tags$hr()
		),fluidRow(
			id="shoutoutColumn",
			tags$span(id="shoutouts",
				tags$label("Credits:"),
				tags$br(),
				tags$p(
					tags$a("Assaf Magen,",href="https://www.cs.umd.edu/people/amagen"),
					tags$span("Avinash Das, Joo Sang Lee, Mahfuza Sharmin, "),
					tags$a("Alexander Lugo, ",href="http://alexlugo.net",title="This site was programmed by Alex Lugo. Click here to see his resume."),
					tags$span("Silvio Gutkind, Alejandro A. Schaffer, Eytan Ruppin, "),
					tags$a("Sridhar Hannenhalli",href="https://www.cbcb.umd.edu/~sridhar",title="Sridhar's lab site")
				)
			),
			tags$p(
				"Refer to the methods section of the ",
				tags$a("original manuscript",href="https://doi.org/10.1101/253120",target="_blank"),
				" for additional details"
			),
			tags$a("Link to the full story and methods",href="https://doi.org/10.1101/253120",target="_blank"),
			tags$br(),
			tags$a("Portal Usage Instructions",href="readme.html",target="_blank")
		)
	))
))
