interface LabelPreview {
  inspection:{
    id:number;
    upload_date:string;
    updated_at:string;
    sample_id:number;
    picture_set_id:number;

  };
  label_info:{
    id:number;
    product_name:string;
    company_info_id:number;
    manufacturer_info_id:number;
  };
  company_info:{
    id:number;
    company_name:string;
  }
}

export default LabelPreview;
