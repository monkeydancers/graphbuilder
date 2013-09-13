
$(function (){
  $('#cy').cytoscape({
    layout: {
      name: 'circle'
    },
    
    style: cytoscape.stylesheet()
      .selector('node')
        .css({
          'shape': 'data(faveShape)',
          'width' : '96px',
          'height': '96px',
//          'width': 'mapData(weight, 40, 80, 20, 60)',
          'font-family' : 'Source Sans Pro, sans-serif',
          'font-size' : '18px', 
          'content': 'data(name)',
          'text-valign': 'bottom',
          'text-outline-width': 2,
          'text-outline-color': '#ff9733',
          'background-color': 'data(faveColor)',
          'color': '#fff',
          'background-image' : 'images/node.png'
        })
      .selector(':selected')
        .css({
          'border-width': 3,
          'border-color': '#ffffff'
        })
      .selector('edge')
        .css({
          'width': 'mapData(strength, 70, 100, 2, 6)',
          'target-arrow-shape': 'triangle',
          'source-arrow-shape': 'none',
          'line-color': 'data(faveColor)',
          'source-arrow-color': 'data(faveColor)',
          'target-arrow-color': 'data(faveColor)'
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
        }),
    
    elements: {
      nodes: [
        { data: { id: 'j', name: 'Scen 1', weight: 65, faveColor: '#ff9733', faveShape: 'circle' } },
        { data: { id: 'e', name: 'Scen 2', weight: 45, faveColor: '#ff9733', faveShape: 'circle' } },
        { data: { id: 'k', name: 'Scen 3', weight: 75, faveColor: '#ff9733', faveShape: 'circle' } },
        { data: { id: 'g', name: 'Scen 4', weight: 70, faveColor: '#ff9733', faveShape: 'circle' } },
        { data: { id: 'h', name: 'Scen 5', weight: 70, faveColor: '#ff9733', faveShape: 'circle' } }

      ],
      edges: [
        { data: { source: 'j', target: 'e', faveColor: '#ff9733', strength: 120 } },

       
        { data: { source: 'e', target: 'k', faveColor: '#ff9733', strength: 120 } },
        { data: { source: 'e', target: 'g', faveColor: '#ff9733', strength: 60 }, classes: 'questionable' },
        

        { data: { source: 'k', target: 'g', faveColor: '#ff9733', strength: 120 } },
        
        { data: { source: 'k', target: 'h', faveColor: '#ff9733', strength: 120 } },

        { data: { source: 'g', target: 'h', faveColor: '#ff9733', strength: 120 } },


      ]
    },
    
    ready: function(){
      window.cy = this;
      this.cytoscapePanzoom();

      cy.on('select', 'node', function(evt){
          $('#context-menu').css({
            'display' : 'block',
            'left' : evt.cyTarget.renderedPosition('x') + 40 +  'px',
            'top' : evt.cyTarget.renderedPosition('y') - 40 + 'px',
            'z-index' : '122'
          }).click( function(evt){ console.log("EPPLO") });

      });
      cy.on('unselect', 'node', function(evt){
          $('#context-menu').css({
            'display' : 'none',
            'left' : '-100px',
            'top' :  '-100px',
          });
      });


      

      
      // giddy up
    }
  });
  

});
