import json

vertlist = []
texcoordlist = []
facelist = []

def main():
    obj = input("Enter path of obj file\n")
    file = open(obj, "r")

    for line in file:
        data = line.split()
        if data[0] == '#':
            continue
        if data[0] == 'v':
            vertlist.append([data[1], data[2], data[3]])
        if data[0] == "vt":
            texcoordlist.append([data[1], data[2]])
        if data[0] == "f":
            facelist.append(data[1:])
    
    finallist = []

    for face in facelist:
        newface = []
        for vert in face:
            newverts = []
            verts = vert.split("/")
            v = int(verts[0])
            texcoord = int(verts[1])

            notflat = vertlist[v-1]
            for p in notflat:
                newverts.append(p)
            
            notflat = texcoordlist[texcoord-1]
            for p in notflat:
                newverts.append(p)
            
            newface.append(newverts)
        finallist.append(newface)
    
    export = json.dumps(finallist)
    exportfile = open(obj[:-4] + ".json", "x")
    exportfile.write(export)
main()