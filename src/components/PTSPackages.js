import React from 'react';
import PTSMirrors from './PTSMirrors';

/**
 * Diplays the package details of the JSON results
 *  @param props array The Mirror data
 * 
 * Package -> [{identifier, pts-filename, pts-filesize, pts-sha256, pts-md5, mirror[]}]
 */
const PTSPackages = props => {
    const {identifier, "pts-filename" : filename, "pts-filesize" : filesize, "pts-sha256" : sha256, "pts-md5" : md5, mirror} = props.data;

    const getMirrors = (props) => {

        let status = "unknown";

        if (props.status) {
            status = (<span>{props.status}</span>);     
        } else {
            status = props.map((mir, key) => {
                return <PTSMirrors key={key} data={mir}/>
            })
        }
    
        return status;   
    }

    return (
        <React.Fragment>
            <div><b>Identifier </b>{identifier} </div>
            <div><b>MD5</b>{md5} </div>
            <div><b>SHA256</b> {sha256} </div>

            <div>... {filename} ...{filesize} 
                <ul>
                  {getMirrors(mirror)}
                </ul>
            </div>
        </React.Fragment>
    )
}

export default PTSPackages;