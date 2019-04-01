# load libraries/data
library(methods)
library(survival)
library(shiny)
library(rentrez)

load("data/genes.data.RData")
load("data/patient.data.RData")
load("data/interactions.data.RData")

# initial data formatting
formula <- with(data,Surv(time,status==1))
fullKm <- survfit(formula~1,data=data,conf.type="log-log")
data <- data.frame(data)
rm(formula)

shinyServer(function(input,output){
	output$km <- renderPlot({
		if(is.null(input$gene)){
			graphData("")
		}else{
				if(input$gene1=="none"){
					graphNode(input$gene,input$bins)
				}else{
					graphEdge(input$gene,input$gene1,input$addToTitle,input$bins)
				}
		}
	},width=700,height=350)
	graphNode <- function(gene,selected.bins){
		i <- match(gene,genes)
		bins <- get.gene.bin(i)#bin.map[i,]
		graphData(gene)
		binsets <- split(data,bins[])#data.frame(data[,1:2])
		colors <- c("red","blue","green")
		#legend(1,0.4,c("low","med","high"),col=colors,lty=c(1,1))

		if(substr(selected.bins,1,1)=="1"){
			d <- binsets$"0"
			clin <- with(d,Surv(time,status==1))
			km <- survfit(clin~1,data=d,conf.type="log-log")
			lines(km,conf.int=F,mark.time=F,col=colors[1])
		}
		if(substr(selected.bins,2,2)=="1"){
			d <- binsets$"1"
			clin <- with(d,Surv(time,status==1))
			km <- survfit(clin~1,data=d,conf.type="log-log")
			lines(km,conf.int=F,mark.time=F,col=colors[2])
		}
		if(substr(selected.bins,3,3)=="1"){
			d <- binsets$"2"
			clin <- with(d,Surv(time,status==1))
			km <- survfit(clin~1,data=d,conf.type="log-log")
			lines(km,conf.int=F,mark.time=F,col=colors[3])
		}

		rm(binsets,bins,clin,d,km)
	}
	graphEdge <- function(gene,gene1,addToTitle,selected.bins){
		i <- match(gene,genes)
		i1 <- match(gene1,genes)
		bins <- (get.gene.bin(i)*3)+get.gene.bin(i1)+1#(bin.map[i,]*3)+bin.map[i1,]+1
		graphData(paste(gene," vs. ",gene1,addToTitle,sep=""))
		if(length(bins)==0){
			return()
		}
		binsets <- split(data.frame(data[,1:2]),bins[])#data[,1:2]
		colors <- c("blue","purple","red","cyan","green","orange","yellow","pink","brown")
		#legend(1,0.7,c("low-low (1)","low-med (2)","low-high (3)","med-low (4)","med-med (5)","med-high (6)","high-low (7)","high-med (8)","high-high (9)"),col=colors,lty=c(1,1))

		if(substr(selected.bins,1,1)=="1"){
			bin <- binsets$"1"
			clin <- with(bin,Surv(time,status==1))
			km <- survfit(clin~1,data=bin,conf.type="log-log")
			lines(km,conf.int=F,mark.time=F,col=colors[1])
		}
		if(substr(selected.bins,2,2)=="1"){
			bin <- binsets$"2"
			clin <- with(bin,Surv(time,status==1))
			km <- survfit(clin~1,data=bin,conf.type="log-log")
			lines(km,conf.int=F,mark.time=F,col=colors[2])
		}
		if(substr(selected.bins,3,3)=="1"){
			bin <- binsets$"3"
			clin <- with(bin,Surv(time,status==1))
			km <- survfit(clin~1,data=bin,conf.type="log-log")
			lines(km,conf.int=F,mark.time=F,col=colors[3])
		}
		if(substr(selected.bins,4,4)=="1"){#7,7
			bin <- binsets$"4"
			clin <- with(bin,Surv(time,status==1))
			km <- survfit(clin~1,data=bin,conf.type="log-log")
			lines(km,conf.int=F,mark.time=F,col=colors[4])#4
		}
		if(substr(selected.bins,5,5)=="1"){#4,4
			bin <- binsets$"5"
			clin <- with(bin,Surv(time,status==1))
			km <- survfit(clin~1,data=bin,conf.type="log-log")
			lines(km,conf.int=F,mark.time=F,col=colors[5])#5
		}
		if(substr(selected.bins,6,6)=="1"){#5,5
			bin <- binsets$"6"
			clin <- with(bin,Surv(time,status==1))
			km <- survfit(clin~1,data=bin,conf.type="log-log")
			lines(km,conf.int=F,mark.time=F,col=colors[6])#6
		}
		if(substr(selected.bins,7,7)=="1"){#8,8
			bin <- binsets$"7"
			clin <- with(bin,Surv(time,status==1))
			km <- survfit(clin~1,data=bin,conf.type="log-log")
			lines(km,conf.int=F,mark.time=F,col=colors[7])#8
		}
		if(substr(selected.bins,8,8)=="1"){#9,9
			bin <- binsets$"8"
			clin <- with(bin,Surv(time,status==1))
			km <- survfit(clin~1,data=bin,conf.type="log-log")
			lines(km,conf.int=F,mark.time=F,col=colors[8])#9
		}
		if(substr(selected.bins,9,9)=="1"){#6,6
			bin <- binsets$"9"
			clin <- with(bin,Surv(time,status==1))
			km <- survfit(clin~1,data=bin,conf.type="log-log")
			lines(km,conf.int=F,mark.time=F,col=colors[9])#9
		}

		rm(clin,bins,bin,km)
	}
	get.gene.bin <- function(i,files=50){
		size <- ceiling(length(genes)/files)
		total <- 0
		file_i <- (i%/%size)+1
		index <- i%%size
		load(paste("data/bins/bins",file_i,".RData",sep=""))
		return(bin.map[index,])
	}
	graphData <- function(label){
		plot(fullKm,conf.int=F,mark.time=F,xlab="Time (Months)",ylab="Survival Rate",main=label)
	}
	getRole <- function(index){
		i <- match(genes[index],roles[,1])
		if(!is.na(i)){
			return(roles[i,2])
		}
		return("none")
	}

	get.interactions <- function(gene.names,view,interaction.types){
		if(view=="base" || length(interaction.types)==0){
			return(base.view.interactions)
		}
		quantile <- 0.99
		indices <- match(unique(toupper(gene.names)),genes)
		indices <- indices[!is.na(indices)]
		if( length(indices) == 0){
			return(base.view.interactions)
		}

		matches <- (
			(shuffled[,1] %in% indices | shuffled[,2] %in% indices)
			& (-shuffled[,3]*sign(shuffled[,4])) %in% interaction.types)
		if( sum(matches) == 0 ){
			return(base.view.interactions)
		}
		threshold <- quantile(abs(shuffled[matches,4]),quantile)

		matches <- (
			(states[,1] %in% indices | states[,2] %in% indices)
			& (-states[,3]*sign(states[,4])) %in% interaction.types
			& abs(states[,4])>=threshold)
		if( sum(matches) == 0){
			return(base.view.interactions)
		}
		frame <- as.data.frame(states[matches,])
		return(frame)
	}

	output$nodeData <- renderPrint({
		sep <- ",,"
		if(is.na(input$searched)){#is.null()
			print("")
			return()
		}
		searched <- strsplit(toupper(input$searched),",")[[1]]
		if(length(searched)==0){
			print("")
			return()
		}
		network <- "specific"
		if(!is.null(input$view)){
			network <- input$view
		}
		if(is.null(input$binsFilter)){
			interactions <- get.interactions(searched,network,c(1,-1,2,-2,3,-3,5,-5,6,-6,9,-9))
		}else{
			interactions <- get.interactions(searched,network,as.integer(strsplit(input$binsFilter,",")[[1]]))
		}
		#binColors <- c("blue","purple","red","gray","green","orange","gray","gray","brown")
		binColors <- c('#fbb4ae','#b3cde3','#ccebc5','gray','#decbe4','#fed9a6','gray','gray','#ffffcc')
		for(s in 1:length(searched)){
			index <- match(searched[s],genes)
			if(!is.na(index)){
				con <- subset(interactions,interactions[,"y"]==index | interactions[,"x"]==index)
				x <- paste(searched[s],getRole(index),"true",sep=sep)
				if(length(con[,1])<=1){
					print(x)
				}else{
					for(i in 1:length(con[,1])){
						color <- binColors[con[i,"bin"]]
						if(con[i,"y"]==index){
							flip <- 1
							connection <- genes[con[i,"x"]]
						}else{
							flip <- -1
							connection <- genes[con[i,"y"]]
						}
						width <- con[i,4]
						x <- paste(x,connection,color,width,flip,sep=sep)
					}
					print(x)
					for(i in 1:length(con[,1])){
						if(con[i,"y"]==index){
							index1 <- con[i,"x"]
						}else{
							index1 <- con[i,"y"]
						}
						con1 <- subset(interactions,interactions[,"y"]==index1 | interactions[,"x"]==index1)
						x1 <- paste(genes[index1],getRole(index1),"false",sep=sep)
						if(length(con1[,1])>0){
							for(a in 1:length(con1[,1])){
								color <- binColors[con1[a,"bin"]]
								if(con1[a,"y"]==index1){
									flip <- 1
									connection <- genes[con1[a,"x"]]
								}else{
									flip <- -1
									connection <- genes[con1[a,"y"]]
								}
								width <- con1[a,4]
								x1 <- paste(x1,connection,color,width,flip,sep=sep)
							}
						}
						print(x1)
					}
				}
			}
		}
		rm(interactions)
	})
	output$description <- renderPrint({
		if(is.null(input$gene)){
			return("")
		}
		x <- summary(input$gene)
		if(!is.null(input$gene1) && input$gene1!="none"){
			x <- paste(x,summary(input$gene1),sep=",,,")
		}
		print(x)
		rm(x)
	})
	summary <- function(name){
		ids <- entrez_search(db="gene",term=paste(name,"[GENE] AND human[ORGN]",sep=""))$id
		summary <- entrez_summary(db="gene",id=ids[1])$summary
		if(length(ids)>1){
			for(i in 2:length(ids)){
				if(is.null(summary) | summary==""){
					summary <- entrez_summary(db="gene",id=ids[i])$summary
				}else{
					break
				}
			}
		}
		if(is.null(summary) | summary==""){
			summary <- "No description available"
		}
		return(paste(name,summary,sep=": "))
	}
	output$suggestions <- renderUI({
		search <- strsplit(toupper(input$searched),",")[[1]]
		if(length(search)==0){
			tagList()
			return()
		}
		search <- tail(search,n=1)
		if(nchar(search)>=3 & match(search,genes,nomatch=-1)==-1){
			sug <- subset(genes,grepl(search,genes[]))
			x <- vector("list",length(sug))
			if(length(x)==0){
				tagList()
				return()
			}
			for(a in 1:length(sug)){
				x[[a]] <- tags$div(sug[a],class="suggestion")
			}
			tagList(x)
		}else{
			tagList()
		}
	})
})
