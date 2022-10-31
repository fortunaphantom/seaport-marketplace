import { Grid } from "@mui/material";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AssetCard from "./AssetCard";

interface ICollectionAccordionProps {
  collection: ICollection;
}

const CollectionAccordion = (props: ICollectionAccordionProps) => {
  const { collection } = props;

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
      >
        <Typography variant="h5">{collection.collectionInfo.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {collection.assets.map((asset) => (
            <Grid item xs={3}>
              <AssetCard
                asset={asset}
                collectionInfo={collection.collectionInfo}
              />
            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default CollectionAccordion;
