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

		this.cy.add([
		  {
		    group: "nodes",
		    data: { 
		      weight: 75, 
		      id: new_node_id, 
		      name: 'Ny nod'
		    },
		    position: { 
		      x: parent.position('x') + 450, 
		      y: parent.position('y') - 20 
		    },
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
	// Private
	_setup_menu: function(){

		$('#context-menu').bind('menu.hide-menu', function(){ 
			$('#context-menu').css({'display' : 'none'});
		});
		$('#new-sub-node').on('click', this.add_node.bind(this)); 	
		$('#new-node').on('click', this.add_main_node.bind(this)); 		
	
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



			this.cy.on('tap', 'node', function(evt){
				if(evt.cyTarget.hasClass('sub-content-node')){
				$('#context-menu').trigger('menu.hide-menu');
					return false;
				}
				if($('#context-menu').css('display') == 'block'){
				$('#context-menu').trigger('menu.hide-menu');
					return false;
				}

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
			.selector('.faded')
				.css({
					'opacity': 0.25,
					'text-opacity': 0
			});
	}, 
	__calculate_spare_node_position: function(parent){
		var base_position = parent.position(); 
		var _angles = []; 
		parent.neighborhood('node').each(function(idx, el){
				if(parent.id == el.target().id){
					var _p = el.position();
				}else{
					var _p = el.position(); 				
				}
				var angle = (Math.atan2((_p.y - base_position.y), (_p.x - base_position.x))*180.0)/Math.PI; 
				if(angle < 0){
					angle = 360-Math.abs(angle);
				}
				_angles.push(angle); 						
		});
		// We're not guaranteed formally that this is sorted correctly (but it should be) .daniel
		_angles.sort(function(a,b){
			return (a-b);
		});
		var mD = 0;
		var max = null; 
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

		var true_angle = _angles[max] + (mD/2); 
		if(true_angle > 360){
			true_angle = true_angle - 360;
		}
		
		var mDr = true_angle*(Math.PI/180);

		var new_pos = {
			x: (Math.cos(mDr)*this.options.creation.defaultDistance) + base_position.x, 
			y: (Math.sin(mDr)*this.options.creation.defaultDistance) + base_position.y
		}
		return new_pos; 
	}
});