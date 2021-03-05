import networkx as nx
import matplotlib

def showXY(fnm, x="kx", y="ky"):
    g = nx.read_graphml(fnm)
    x = nx.get_node_attributes(g, x)
    y = nx.get_node_attributes(g, y)
    coords = list(zip(list(x.values()),list(y.values())))
    pos = dict(list(zip(g.nodes(), coords)))
    nx.draw(g,pos)
    
def showX(fnm):
    g = nx.read_graphml(fnm)
    x = nx.get_node_attributes(g, 'soma_pos')
    y = [0] * len(x)
    coords = list(zip(list(x.values()), y))
    pos = dict(list(zip(g.nodes(), coords)))
    nx.draw(g,pos)    