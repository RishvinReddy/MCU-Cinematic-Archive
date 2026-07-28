import { knowledgeGraph } from './graph-data.js';

class GraphVisualization {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.width = this.container.clientWidth || window.innerWidth;
        this.height = this.container.clientHeight || 800;
        
        this.svg = null;
        this.simulation = null;
        this.zoom = null;
        
        this.nodes = [];
        this.links = [];
        
        this.focusNodeId = null;
        this.prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        
        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            if (this.container.clientWidth) this.width = this.container.clientWidth;
            this.checkMobileView();
        });
        
        window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener('change', e => {
            this.prefersReducedMotion = e.matches;
            if (e.matches && this.simulation) {
                this.simulation.stop();
            }
        });

        document.getElementById('btn-graph-view')?.addEventListener('click', (e) => {
            e.target.classList.add('active');
            document.getElementById('btn-list-view').classList.remove('active');
            this.container.style.display = 'block';
            document.getElementById('list-view-container').style.display = 'none';
        });

        document.getElementById('btn-list-view')?.addEventListener('click', (e) => {
            e.target.classList.add('active');
            document.getElementById('btn-graph-view').classList.remove('active');
            this.container.style.display = 'none';
            document.getElementById('list-view-container').style.display = 'block';
            this.renderListView();
        });
    }

    checkMobileView() {
        const toggles = document.getElementById('view-toggles');
        const listContainer = document.getElementById('list-view-container');
        if (!toggles || !listContainer) return;
        
        if (window.innerWidth <= 768) {
            toggles.style.display = 'flex';
        } else {
            toggles.style.display = 'none';
            this.container.style.display = 'block';
            listContainer.style.display = 'none';
        }
    }

    async init() {
        if (!knowledgeGraph.isInitialized) {
            await knowledgeGraph.initialize();
        }

        const params = new URLSearchParams(window.location.search);
        this.focusNodeId = params.get('focus');

        this.checkMobileView();
        
        this.setupSvg();
        this.buildData();
        this.render();
    }

    setupSvg() {
        this.container.innerHTML = ''; // clear

        this.zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on("zoom", (e) => {
                this.g.attr("transform", e.transform);
            });

        this.svg = d3.select(this.container)
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", [0, 0, this.width, this.height])
            .style("opacity", 0) // for progressive reveal
            .call(this.zoom)
            .on("dblclick.zoom", null)
            .on("click", () => this.handleBackgroundClick());

        this.g = this.svg.append("g");
    }

    buildData() {
        if (!this.focusNodeId || !knowledgeGraph.getEntity(this.focusNodeId)) {
            const subset = knowledgeGraph.getAllEntities().slice(0, 30); 
            this.nodes = subset.map(e => ({ id: e.id, entity: e }));
            this._buildLinksFromCurrentNodes();
            return;
        }

        const focusEntity = knowledgeGraph.getEntity(this.focusNodeId);
        let neighbors = knowledgeGraph.getNeighbors(this.focusNodeId);
        
        const MAX_NEIGHBORS = 20;
        if (neighbors.length > MAX_NEIGHBORS) {
            neighbors = neighbors.sort((a, b) => {
                const priority = { 'movie': 1, 'character': 2, 'event': 3, 'organization': 4 };
                const pA = priority[a._type] || 99;
                const pB = priority[b._type] || 99;
                return pA - pB;
            }).slice(0, MAX_NEIGHBORS);
        }
        
        const nodeMap = new Map();
        const addNode = (ent) => {
            if (!nodeMap.has(ent.id)) {
                nodeMap.set(ent.id, { id: ent.id, entity: ent });
            }
        };

        addNode(focusEntity);
        neighbors.forEach(addNode);

        this.nodes = Array.from(nodeMap.values());
        this._buildLinksFromCurrentNodes();
    }

    _buildLinksFromCurrentNodes() {
        this.links = [];
        const nodeIds = new Set(this.nodes.map(n => n.id));

        knowledgeGraph.relationships.forEach(rel => {
            if (nodeIds.has(rel.source) && nodeIds.has(rel.target)) {
                this.links.push({
                    source: rel.source,
                    target: rel.target,
                    type: rel.type
                });
            }
        });
    }

    render() {
        if (!this.nodes.length) {
            this.container.innerHTML = '<div style="color:var(--clr-text-muted);text-align:center;padding:2rem;">Graph is empty or focus entity not found.</div>';
            return;
        }

        this.simulation = d3.forceSimulation(this.nodes)
            .force("link", d3.forceLink(this.links).id(d => d.id).distance(150))
            .force("charge", d3.forceManyBody().strength(-400))
            .force("center", d3.forceCenter(this.width / 2, this.height / 2))
            .force("collide", d3.forceCollide().radius(50));

        const link = this.g.append("g")
            .selectAll("line")
            .data(this.links)
            .join("line")
            .attr("class", "link");

        const linkText = this.g.append("g")
            .selectAll("text")
            .data(this.links)
            .join("text")
            .attr("class", "link-label")
            .attr("dy", -3)
            .attr("text-anchor", "middle")
            .text(d => d.type.replace('-', ' '));

        const node = this.g.append("g")
            .selectAll("g")
            .data(this.nodes)
            .join("g")
            .attr("class", d => `node graph-node--${d.entity._type} ${d.id === this.focusNodeId ? 'node-pulse' : ''}`)
            .call(this.drag(this.simulation))
            .on("click", (event, d) => this.handleNodeClick(event, d))
            .on("dblclick", (event, d) => {
                window.location.href = knowledgeGraph.getEntityUrl(d.entity);
            })
            .on("mouseover", (event, d) => this.handleMouseOver(d))
            .on("mouseout", () => this.handleMouseOut());

        const getColor = (type) => {
            const colors = {
                'character': 'var(--entity-character)',
                'movie': 'var(--entity-movie)',
                'event': 'var(--entity-event)',
                'organization': 'var(--entity-organization)',
                'location': 'var(--entity-location)',
                'artifact': 'var(--entity-artifact)'
            };
            return colors[type] || 'var(--clr-text-muted)';
        };

        node.append("circle")
            .attr("r", d => d.id === this.focusNodeId ? 25 : 15)
            .attr("fill", d => getColor(d.entity._type))
            .style("stroke", d => d.id === this.focusNodeId ? '#fff' : 'none')
            .style("stroke-width", d => d.id === this.focusNodeId ? '3px' : '0');

        node.append("text")
            .attr("dy", d => d.id === this.focusNodeId ? 38 : 28)
            .attr("text-anchor", "middle")
            .style("fill", "var(--clr-text-main)")
            .style("font-size", d => d.id === this.focusNodeId ? '14px' : '11px')
            .style("pointer-events", "none")
            .text(d => d.entity.name);

        this.simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            linkText
                .attr("x", d => (d.source.x + d.target.x) / 2)
                .attr("y", d => (d.source.y + d.target.y) / 2);

            node
                .attr("transform", d => `translate(${d.x},${d.y})`);
        });

        this.simulation.on("end", () => {
            // Progressive graph entrance
            if (!this.prefersReducedMotion) {
                this.svg.transition().duration(1000).style("opacity", 1);
            } else {
                this.svg.style("opacity", 1);
            }
        });

        setTimeout(() => {
            const focus = this.nodes.find(n => n.id === this.focusNodeId);
            if (focus) {
                const scale = 1;
                const transitionDur = this.prefersReducedMotion ? 0 : 750;
                this.svg.transition().duration(transitionDur).call(
                    this.zoom.transform,
                    d3.zoomIdentity.translate(this.width / 2 - focus.x * scale, this.height / 2 - focus.y * scale).scale(scale)
                );
            }
        }, 300);
    }

    handleMouseOver(d) {
        if (this.prefersReducedMotion) return;
        
        const connectedNodes = new Set();
        connectedNodes.add(d.id);
        
        this.svg.selectAll('.link').each(function(l) {
            if (l.source.id === d.id || l.target.id === d.id) {
                d3.select(this).classed('link-highlight', true);
                connectedNodes.add(l.source.id);
                connectedNodes.add(l.target.id);
            }
        });

        this.svg.selectAll('.node').each(function(n) {
            if (!connectedNodes.has(n.id)) {
                d3.select(this).classed('node-dim', true);
            }
        });
    }

    handleMouseOut() {
        if (this.prefersReducedMotion) return;
        
        this.svg.selectAll('.link').classed('link-highlight', false);
        this.svg.selectAll('.node').classed('node-dim', false);
    }

    handleBackgroundClick() {
        this.svg.selectAll('.link').classed('link-highlight', false);
        this.svg.selectAll('.node').classed('node-dim', false);
    }

    handleNodeClick(event, d) {
        if (window.SoundManager && window.SoundManager.play) {
            window.SoundManager.play('focus');
        }
        const url = new URL(window.location);
        url.searchParams.set('focus', d.id);
        window.history.pushState({}, '', url);
        
        this.focusNodeId = d.id;
        this.g.remove(); 
        this.setupSvg();
        this.buildData();
        this.render();
    }

    renderListView() {
        const listContainer = document.getElementById('list-view-container');
        if (!listContainer) return;
        
        if (!this.nodes.length) {
            listContainer.innerHTML = '<p class="muted">No data to display.</p>';
            return;
        }

        let html = '<div class="connections-list-view">';
        this.nodes.forEach(n => {
            html += `
                <a href="${knowledgeGraph.getEntityUrl(n.entity)}" class="entity-badge" style="display:flex; justify-content:space-between; text-decoration:none; color:inherit;">
                    <strong>${n.entity.name}</strong>
                    <span class="muted" style="margin-left: 0.5rem;">${n.entity._type.toUpperCase()}</span>
                </a>
            `;
        });
        html += '</div>';
        listContainer.innerHTML = html;
    }

    drag(simulation) {
        const self = this;
        function dragstarted(event) {
            if (!event.active && !self.prefersReducedMotion) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }
        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }
        function dragended(event) {
            if (!event.active && !self.prefersReducedMotion) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }
        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('d3-graph-container')) {
        const graph = new GraphVisualization('d3-graph-container');
        graph.init();
    }
});
