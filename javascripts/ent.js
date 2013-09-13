window.ent = Object.create({
	initialize: function(container, options){

		this.options = $.extend({
			debug: false,
			cytoscape: {
				defaultNodes:  [
		      { data: { id: 'j', name: 'Scen 1', weight: 65, faveColor: '#ff9733', faveShape: 'circle' } },
		      { data: { id: 'e', name: 'Scen 2', weight: 45, faveColor: '#ff9733', faveShape: 'circle' } },
		      { data: { id: 'k', name: 'Scen 3', weight: 75, faveColor: '#ff9733', faveShape: 'circle' } },
		      { data: { id: 'g', name: 'Scen 4', weight: 70, faveColor: '#ff9733', faveShape: 'circle' } },
		      { data: { id: 'h', name: 'Scen 5', weight: 70, faveColor: '#ff9733', faveShape: 'circle' } }

		    ], 
		    defaultEdges: [
		      { data: { source: 'j', target: 'e', faveColor: '#ff9733', strength: 120 } },		     
		      { data: { source: 'e', target: 'k', faveColor: '#ff9733', strength: 120 } },
		      { data: { source: 'e', target: 'g', faveColor: '#ff9733', strength: 60 }, classes: 'questionable' },		      
		      { data: { source: 'k', target: 'g', faveColor: '#ff9733', strength: 120 } },		      
		      { data: { source: 'k', target: 'h', faveColor: '#ff9733', strength: 120 } },
		      { data: { source: 'g', target: 'h', faveColor: '#ff9733', strength: 120 } }
		    ]
			}, 
			creation: {
				defaultAngle: 20, 
				defaultDistance: 200
			}
		}, (options || {})); 
		
		this.idCounter = 12; 
		
		// Build a stylesheet using the cytoscape default stylesheet
		this.defaultStyleSheet 	= this._build_style_sheet(); 
		// Construct the cytoscape object, pass along default data
		this._build_cytoscape(this.options.cytoscape.defaultNodes, this.options.cytoscape.defaultEdges); 
		// Hook on menu
		this._setup_menu(); 



		return this; 
	},

	add_main_node: function(){
		$('#context-menu').trigger('menu.hide-menu');

		parent = this.cy.$(":selected");

		new_node_id = this.idCounter++ +  "_new";
		new_edge_id = new_node_id + this.idCounter++ + "_edge";

		var pos = this.__calculate_spare_node_position(parent); 


		this.cy.add([
		  {
		    group: "nodes",
		    data: { 
		      weight: 75, 
		      id: new_node_id, 
		      name: 'Ny nod'
		    },
		    position: pos,
		  },
		  {
		    group: "edges",
		    data: { 
		      id: new_edge_id, 
		      source: parent.id(), 
		      target: new_node_id, 
		      strength: 120 
		    }, 
		  }
		]);
	},
	// Add a new node to the selected node
	add_node: function(){
		$('#context-menu').trigger('menu.hide-menu');
		var parent = this.cy.$(":selected");

		new_node_id = parent.id() + this.idCounter++ +  "_new";
		new_edge_id = new_node_id + this.idCounter++ + "_edge";

		var pos = this.__calculate_spare_node_position(parent); 
		this.cy.add([
		  {
		    group: "nodes",
		    data: { 
		      weight: 75, 
		      id: new_node_id, 
		      name: 'Ny nod'
		    },
		    position: pos,
		    classes: 'sub-content-node'
		  },
		  {
		    group: "edges",
		    data: { 
		      id: new_edge_id, 
		      source: parent.id(), 
		      target: new_node_id, 
		      strength: 50 
		    }, 
		    classes: 'sub-content-node-edge',
		    selectable: false
		  }
		]);
	},
	create_edge:function(){
		var parent = this.cy.$(":selected");
		$('#context-menu').trigger('menu.hide-menu');
		$("#cy").cytoscapeEdgehandles('start', parent.id());
	},
	edit_node: function(evt){
		// Daniel this might be a very cumbersome way to do this ? 

		// node = this.$('#' + evt.data['menu'].data('active-node-id'));
		node_id = '#' + evt.data['menu'].data('active-node-id')
		node = this.cy.$(node_id);

		$('#edit-node-form-placeholder').css({'display' : 'none'})
		$('#edit-node-form').css({'display' : 'inline'})

		$('#inputNodeName').val(node.data('name'));
	},
	// Private
	_setup_menu: function(){

		var menu = $('#context-menu');
		menu.bind('menu.hide-menu', function(){ 
			menu.data('active-node-id',  null);
			menu.css({'display' : 'none'});
		});
		
		$('#settings').on('click', {'menu' : menu}, this.edit_node.bind(this)); 	
		$('#new-sub-node').on('click', this.add_node.bind(this)); 	
		$('#new-node').on('click', this.add_main_node.bind(this)); 		
		$('#connect-nodes').on('mousedown', this.create_edge.bind(this));
	
	}, 
	_build_cytoscape: function(defaultNodes, defaultEdges){
		var _t = this; 
		$cryto_container =  $('#cy');
		cy = $cryto_container.cytoscape({
		  layout: {
		    name: 'circle'
		  },
		  showOverlay: false,
		  
		  style: this.defaultStyleSheet,
		  
		  elements: {
		    nodes: defaultNodes,
		    edges: defaultEdges 
		  },
		  ready: function(){
		  	_t.cy = this; 
		  	_t._cytoscape_ready.apply(_t); 
		  	$cryto_container.cytoscapePanzoom({
		  		'maxZoom' : 2,
		  		'zoomInIcon' : 'glyphicon glyphicon-plus',
		  		'zoomOutIcon' : 'glyphicon glyphicon-minus',
		  		'resetIcon' : 'glyphicon glyphicon-fullscreen',
		  		'sliderHandleIcon' : ''
		  	});
		  }
		});


	},
	_cytoscape_ready: function(){

			this.cy.on('drag', 'node', function(evt){
				$('#context-menu').trigger('menu.hide-menu');
			});
			this.cy.on('zoom', function(evt){
				$('#context-menu').trigger('menu.hide-menu');
			});
			this.cy.on('pan', function(evt){
				$('#context-menu').trigger('menu.hide-menu');
			});

			// Data updaters
			this.cy.on('data', function(evt){
				if(this.options.debug){
					console.log("Data changed");					
				}
			});
			this.cy.on('free', function(evt){
				if(this.options.debug){
					console.log("Position changed");					
				}
			});
			this.cy.on('add', function(evt){
				if(this.options.debug){
					console.log("Element added");					
				}
			});

			this.cy.$('node').not('.sub-content-node').on('select', function(){
				this.neighborhood('.sub-content-node').select();
			});

			// This is a temporary solution, the plugin itself needs
			// extensive finetuning to work as expected, and remove the 
			// multi-selection bug and similar .daniel
			$("#cy").cytoscapeEdgehandles({
				lineType: "straight",
				preview: false,
				handleSize: 12,
				handleLineWidth:5,
				handleColor: "#5CC2ED",
				edgeType: function(){
					return 'flat';
				},
				nodeParams: function(){
					return {
						classes: "intermediate"
					};
				},
				start: function( sourceNode ){
					console.log("start(%o)", sourceNode);
				},
				complete: function( sourceNode, targetNodes, added ){
					console.log("complete(%o, %o, %o)", sourceNode, targetNodes, added);
					added.data('strength', 120);
				},
				stop: function( sourceNode ){
					console.log("stop(%o)", sourceNode);
				}
			});

			this.cy.on('tap', 'node', function(evt){
				if(evt.cyTarget.hasClass('sub-content-node')){
				$('#context-menu').trigger('menu.hide-menu');
					return false;
				}
				if($('#context-menu').css('display') == 'block'){
				$('#context-menu').trigger('menu.hide-menu');
					return false;
				}

				$('#context-menu').data('active-node-id', evt.cyTarget.id());
				$('#context-menu').css({
					'display' : 'block',
					'left' : evt.cyTarget.renderedPosition('x') + 40 +  'px',
					'top' : evt.cyTarget.renderedPosition('y') - 40 + 'px',
					'z-index' : '1002'
				});
			});
	},
	_build_style_sheet: function(){
		return cytoscape.stylesheet()
			.selector('node')
		  	.css({
		    	'width' : '96px',
		      'height': '96px',
		      'font-size' : '18px', 
		      'content': 'data(name)',
		      'text-valign': 'bottom',
		      'text-outline-width': 2,
		      'text-outline-color': '#FF9733',
		      'color': '#fff',
		      'background-image' : 'images/node.png'
		  })
		  .selector('node.sub-content-node')
				.css({
					'width' : '180px',
					'height': '40px',
					'background-image' : 'none',
					'shape': 'rectangle',
					'text-valign': 'center',
					'background-color' : '#CCCCCC'
			})
			.selector(':selected')
				.css({
					'border-width': 3,
					'border-color': '#FFFFFF'
			})
			.selector('edge')
				.css({
					'width': 'mapData(strength, 70, 100, 2, 6)',
					'target-arrow-shape': 'triangle',
					'source-arrow-shape': 'none',
					'line-color' : '#FF9733',
					'target-arrow-color': '#FF9733'
			})
			.selector('edge.sub-content-node-edge')
				.css({
					'line-color': "#CCCCCC",
					'target-arrow-color': "#CCCCCC", 
					'target-arrow-shape': 'circle'
			})
			.selector('edge.questionable')
				.css({
					'line-style': 'dotted',
					'target-arrow-shape': 'none'
			})
				.selector("edge.ui-cytoscape-edgehandles-preview")
					.css({
						"line-color": "#5CC2ED",
						"source-arrow-color": "#5CC2ED",
						"target-arrow-color": "#5CC2ED", 
						'target-arrow-shape': 'triangle',
						'source-arrow-shape': 'none'
					})

			.selector(".ui-cytoscape-edgehandles-source")
				.css({
					"border-color": "#5CC2ED",
					"border-width": 3
				})
				.selector(".ui-cytoscape-edgehandles-target")
					.css({
						"border-color": "#5CC2ED",
						"border-width": 3
					})
			.selector('.faded')
				.css({
					'opacity': 0.25,
					'text-opacity': 0
			});
	}, 
	__calculate_spare_node_position: function(parent){
		// Fetch the base position of the parent, this will be used as origin
		var base_position = parent.position(); 
		var _angles = []; 
		// Fetch all nodes connected to the parent, determine the angle of 
		// the edge, using 0° as horizontal X-axis on a normalized 360° circle.
		parent.neighborhood('node').each(function(idx, el){
				var _p = el.position();
				var angle = (Math.atan2((_p.y - base_position.y), (_p.x - base_position.x))*180.0)/Math.PI; 
				if(angle < 0){
					angle = 360-Math.abs(angle);
				}
				_angles.push(angle); 						
		});
		// Sort the array in-place using not the standard lexicographical sort but a standard
		// numeric sort - hooray for javascript weirdness! 
		_angles.sort(function(a,b){
			return (a-b);
		});
		// Store a back-reference to maximum gap between consecutive angles (since the list is 
		// sorted, we know that two consecutive angles are increasing in acuteness). 
		var mD = 0;
		var max = null; 
		// For each angle, check the difference between it and the next one, handling the case
		// of the last angle in the list (which is compared against the first one), and fetch
		// the ones with the greatest gap.
		for(var i = 0; i < _angles.length; i++){
			var next = _angles[i+1]; 
			if(next){
				var _d = next - _angles[i]; 				
			}else{
				// This is the last element
				var _d = (360 - _angles[i]) + _angles[0]; 
			}			
			if(_d > mD){
				mD = _d;
				max = i; 
			}
		}

		// Calculate the true angle of the mid of the resulting largest gap, 
		// using the normalized coordinate system.
		var true_angle = _angles[max] + (mD/2); 
		if(true_angle > 360){
			true_angle = true_angle - 360;
		}
		// Convert the angle to radians, since sin/cos use radians.
		var mDr = true_angle*(Math.PI/180);

		// Increase distance if gap is too narrow
		if(mD < 40){
			factor = Math.ceil(mD/40)+1; 
		}else{
			factor = 1;
		}

		// Calculate the new position using standard cartesian coordinates.
		// TODO - if our distance is too small here, increase the distance automagically .daniel
		var new_pos = {
			x: (Math.cos(mDr)*(this.options.creation.defaultDistance*factor)) + base_position.x, 
			y: (Math.sin(mDr)*(this.options.creation.defaultDistance*factor)) + base_position.y
		}
		return new_pos; 
	}
});