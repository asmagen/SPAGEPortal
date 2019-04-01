# SPAGE Portal
## Portal Usage Instructions
### Network and survival plots
The SPAGE network visualizes the Survival Associated Pairwise Gene Expression States (SPAGEs) identified by the [original manuscript](https://doi.org/10.1101/253120). Each node corresponds to a gene and each edge corresponds to a SPAGE of specific type. The SPAGE type, corresponding to a bin and direction of effect on fitness, is annotated by color and edge style. Edge thickness represents the significance of the SPAGE, while the direction of the edge represents the orientation of the gene on the expression bi-partition bin map, originating from the X axis and directed onto the Y axis.

Selecting a node or an edge (click on the item) renders a Kaplan Meier curve, annotating the survival trends of patients divided into three expression states (corresponding to low, medium and high expression) in the case of a selected gene (node) or 9 joint expression states in the case of a SPAGE (edge). The legend is presented with buttons allowing to add or remove patient groups.

The network canvas can be dragged and the individual nodes can be moved around.

### Sidebar
The ‘Search genes’ text box allows input of comma-separated gene names which will be rendered on the left panel. In case of ambiguous gene name, a drop down list allows the users to select the appropriate gene.

To render a gene list from file, provide a comma-separated text file and upload via ‘Choose Files’.

Filter single-interaction nodes allows to remove genes with no SPAGEs from display.

Use Target-Specific FDR provides the option to render the SPAGEs based on the target-specific FDR correction as described in the original work.

Filter interaction type allows to display only interactions of specific types (i.e. combination of bin and fitness effect).

Zoom enables to zoom in and out of the network canvas.

Click on the legend to expand into a bigger size.

Export functionality allows to download a PDF file showing the current network and the KM plot being displayed.
