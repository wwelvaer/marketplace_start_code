const db = require("../models");
const sequelize = require('sequelize');
const PropertyCompany = db.PropertyCompany

// returns all listings
exports.getTaxonomy = (req, res) => {
    db.sequelize.query("Select dimension, dimensionValue, mandatory, selected, exclusive, orderNrDimension from TaxonomyView TV left join SelectedPropertiesView SPV on TV.dimensionValue = SPV.property order by TV.orderNrDimension, TV.orderNrValue;")
        .then(taxonomy => {
            return res.status(200).send({ taxonomy: taxonomy[0] })
        })
};

exports.getProperties = (req, res) => {
    db.sequelize.query("Select D.name as dimension, DV.name as dimensionValue from Dimension D inner join DimensionValue DV on D.name = DV.dimension left Join PropertyCompany PC on DV.name = PC.property left join Company C on PC.company = C.name where selected;")
        .then(properties => {
            //console.log(properties.totalcount)
            let r = {}
            properties[0].forEach(property => {
                if (property.dimension in r)
                    r[property.dimension].push(property.dimensionValue)
                else
                    r[property.dimension] = [property.dimensionValue]
            })
            res.status(200).send(r)
        }).catch(err => {
            res.status(500).send({ message: err.message });
        })
}

// exports.getConstraintsValue = (req, res) => {
//     db.sequelize.query("select * from ConstraintValue").then(constraints => {
//         return res.status(200).send({ constraints })
//     })
// };

exports.deleteProperty = (req, res) => {
    PropertyCompany.destroy({
        where: { property: req.params.property, company: req.params.company }
    })
        .then(numDeleted => {
            if (numDeleted) {
                res.status(200).send("Record deleted");
            } else {
                res.status(404).send("Record not found");
            }
        })
        .catch(error => {
            res.status(500).send(error);
        });
}

exports.createProperty = (req, res) => {
    PropertyCompany.create({
        property: req.body.property,
        company: req.body.company
    }).then(l => {
        res.send({ message: "property was created successfully!" });
    })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

exports.deleteProperties = (req, res) => {
    PropertyCompany.destroy({
        where: { company: req.body.company },
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} properties were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing properties."
            });
        });
};
