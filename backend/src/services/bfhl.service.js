// bfhl.service.js for processing the graph data and generating the required output
const processGraphData = (data) => {
    const invalid_entries = [];
    const duplicate_edges =[];
    const seen = new Set();
    const added_dup = new Set();
    const nodes = new Set();
    const child_to_parent = {};
    const directed_adj = {};

    for (let item of data) {
       
        if (typeof item !== 'string') {
            invalid_entries.push(String(item));
            continue;
        }

        const str = item.trim();

       
        if (!/^[A-Z]->[A-Z]$/.test(str) || str[0] === str[3]) {
            invalid_entries.push(str);
            continue;
        }

        // 3. Handle duplicates
        if (seen.has(str)) {
            if (!added_dup.has(str)) {
                duplicate_edges.push(str);
                added_dup.add(str); 
            }
            continue;
        }

        seen.add(str);

        const u = str[0]; // Parent
        const v = str[3]; // Child

        
        if (child_to_parent[v]) {
            
        }

        // Add to graph tracking
        child_to_parent[v] = u;
        nodes.add(u);
        nodes.add(v);

        if (!directed_adj[u]) directed_adj[u] = [];
        if (!directed_adj[v]) directed_adj[v] =[];
        directed_adj[u].push(v);
    }

   
    const undirected_adj = {};
    for (let u of nodes) undirected_adj[u] =[];
    for (let v in child_to_parent) {
        const u = child_to_parent[v];
        undirected_adj[u].push(v);
        undirected_adj[v].push(u);
    }

    const visited = new Set();
    const hierarchies =[];
    let total_trees = 0;
    let total_cycles = 0;
    let max_depth = 0;
    let largest_tree_root = "";

    // Recursive function to build nested tree object
    const buildTree = (curr) => {
        const obj = {};
        const children = directed_adj[curr] ||[];
        children.sort(); // Sort lexicographically for consistent output
        for (let child of children) {
            obj[child] = buildTree(child);
        }
        return obj;
    };

   
    const getDepth = (curr) => {
        const children = directed_adj[curr] ||[];
        if (children.length === 0) return 1;
        let max = 0;
        for (let child of children) {
            max = Math.max(max, getDepth(child));
        }
        return max + 1;
    };

    const sortedNodes = Array.from(nodes).sort();

    
    for (let node of sortedNodes) {
        if (!visited.has(node)) {
            const comp = [];
            const q = [node];
            visited.add(node);

            
            while (q.length > 0) {
                const curr = q.shift();
                comp.push(curr);
                for (let neighbor of undirected_adj[curr]) {
                    if (!visited.has(neighbor)) {
                        visited.add(neighbor);
                        q.push(neighbor);
                    }
                }
            }

            // A root is a node in this component with no parent
            const comp_roots = comp.filter(n => !child_to_parent[n]).sort();

            if (comp_roots.length > 0) {
                // It is a valid Tree
                const r = comp_roots[0];
                const treeObj = {};
                treeObj[r] = buildTree(r);
                const d = getDepth(r);

                hierarchies.push({
                    root: r,
                    tree: treeObj,
                    depth: d
                });

                total_trees++;

               
                if (d > max_depth) {
                    max_depth = d;
                    largest_tree_root = r;
                } else if (d === max_depth) {
                    
                    if (largest_tree_root === "" || r < largest_tree_root) {
                        largest_tree_root = r;
                    }
                }
            } else {
               
                comp.sort();
                const r = comp[0]; 
                hierarchies.push({
                    root: r,
                    tree: {},
                    has_cycle: true
                    
                });
                total_cycles++;
            }
        }
    }

    return {
        hierarchies,
        invalid_entries,
        duplicate_edges,
        summary: {
            total_trees,
            total_cycles,
            largest_tree_root
        }
    };
};

module.exports = {
    processGraphData
};